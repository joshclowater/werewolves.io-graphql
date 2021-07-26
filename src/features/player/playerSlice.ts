import { gql } from '@apollo/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk, RootState } from '../../redux/store';
import {
  CreatePlayerMutation,
  CreatePlayerMutationVariables,
  ListGamesQuery,
  ListGamesQueryVariables,
  OnUpdateGameForIdSubscription,
  OnUpdateGameForIdSubscriptionVariables,
  OnUpdatePlayerForIdSubscription,
  OnUpdatePlayerForIdSubscriptionVariables
} from "../../API";
import { listGames } from "../../graphql/queries";
import { createPlayer } from "../../graphql/mutations";
import { onUpdateGameForId, onUpdatePlayerForId } from "../../graphql/subscriptions";

const LIST_GAMES = gql(listGames);
const CREATE_PLAYER = gql(createPlayer);
const ON_UPDATE_GAME_FOR_ID = gql(onUpdateGameForId);
const ON_UPDATE_PLAYER_FOR_ID = gql(onUpdatePlayerForId);

interface PlayerState {
  gameName: string | undefined,
  id: string | undefined,
  name: string | undefined,
  status: 'joiningGame' | 'waitingForGameToStart' | 'roundStarted' | undefined
  role: 'villager' | 'werewolf' | undefined,
  deceased: boolean | null | undefined
}

const initialState: PlayerState = {
  gameName: undefined,
  id: undefined,
  name: undefined,
  status: undefined,
  role: undefined,
  deceased: undefined
}

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<PlayerState['status']>) => {
      state.status = action.payload;
    },
    joinedGame: (state, { payload }: PayloadAction<{ gameName: string, playerName: string, playerId: string }>) => {
      state.gameName = payload.gameName;
      state.id = payload.playerId;
      state.name = payload.playerName;
      state.status = 'waitingForGameToStart';
    },
    updatePlayer: (state, { payload }: PayloadAction<{ role: PlayerState['role'], deceased: PlayerState['deceased'] }>) => {
      state.role = payload.role;
      state.deceased = payload.deceased;
    }
  },
})

const { joinedGame, setStatus, updatePlayer } = playerSlice.actions;

export const selectStatus = (state: RootState) => state.player.status;
const selectId = (state: RootState) => state.player.id;

export const joinGame = (gameName: string, playerName: string): AppThunk => async (
  dispatch,
  getState,
  client
) => {
  dispatch(setStatus('joiningGame'));
  const gameQueryResponse = await client.query<ListGamesQuery, ListGamesQueryVariables>({
    query: LIST_GAMES,
    variables: { filter: { name: { eq: gameName }}}
  });
  console.log('Query game gameQueryResponse', gameQueryResponse);
  const games = gameQueryResponse?.data?.listGames?.items;

  let game;
  if (games?.length && games[0]) {
    if (games.length === 1) {
      game = games[0];
    } else {
      console.error('Multiple games with the same name exist', gameName);
      return;
    }
  } else {
    console.error('Could not find game with name', gameName);
    return;
    // WBN error handling
  }

  const createPlayerResponse = await client.mutate<CreatePlayerMutation, CreatePlayerMutationVariables>({
    mutation: CREATE_PLAYER,
    variables: { input: { gameID: game.id, name: playerName }},
  });
  console.log('Created Player', createPlayerResponse);
  dispatch(joinedGame({ gameName, playerName, playerId: createPlayerResponse?.data?.createPlayer?.id as string }));

  client.subscribe<OnUpdateGameForIdSubscription, OnUpdateGameForIdSubscriptionVariables>({
    query: ON_UPDATE_GAME_FOR_ID,
    variables: { id: game.id }
  }).subscribe({
    next: ({ data }) => {
      console.log('Game updated', data);
      const updatedGame = data?.onUpdateGameForId;
      if (updatedGame) {
        dispatch(setStatus(updatedGame?.status as PlayerState['status']));
      } else {
        console.error('Error getting data from game subscription', data);
      }
    },
    error: (e) => {
      console.error('Error on game subscription', e);
    }
  });
  // WBN do this when game ends
  // updateGameSubscription.unsubscribe();

  const playerId = selectId(getState());
  client.subscribe<OnUpdatePlayerForIdSubscription, OnUpdatePlayerForIdSubscriptionVariables>({
    query: ON_UPDATE_PLAYER_FOR_ID,
    variables: { id: playerId }
  }).subscribe({
    next: ({ data }) => {
      console.log('Player updated', data);
      const updatedPlayer = data?.onUpdatePlayerForId;
      if (updatedPlayer) {
        dispatch(updatePlayer({
          role: updatedPlayer.role as PlayerState['role'],
          deceased: updatedPlayer.deceased
        }));
      } else {
        console.error('Error getting data from player subscription', data);
      }
    },
    error: (e) => {
      console.error('Error on player subscription', e);
    }
  });
};

export default playerSlice.reducer;