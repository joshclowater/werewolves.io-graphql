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
  OnUpdatePlayerForIdSubscriptionVariables,
  UpdatePlayerMutation,
  UpdatePlayerMutationVariables
} from "../../API";
import { listGames } from "../../graphql/queries";
import { createPlayer, updatePlayer } from "../../graphql/mutations";
import { onUpdateGameForId, onUpdatePlayerForId } from "../../graphql/subscriptions";

const LIST_GAMES = gql(listGames);
const CREATE_PLAYER = gql(createPlayer);
const ON_UPDATE_GAME_FOR_ID = gql(onUpdateGameForId);
const ON_UPDATE_PLAYER_FOR_ID = gql(onUpdatePlayerForId);
const UPDATE_PLAYER = gql(updatePlayer);

interface PlayerState {
  gameName: string | undefined,
  gamePlayers : Array< {
    __typename: "Player",
    id: string,
    name: string,
    role?: string | null,
    deceased?: boolean | null,
    gameID: string,
    createdAt: string,
    updatedAt: string,
  } | null > | null | undefined,
  id: string | undefined,
  name: string | undefined,
  status: 'joiningGame' | 'waitingForGameToStart' | 'gameStarted' | 'nightStarted' | 
    'werewolvesPick' | 'submittingWerewolfPick' | 'submittedWerewolfPick' | 'werewolvesPickEnd' | 
    'day' | 'submittingVilllagerPick' | 'submittedVillagerPick' | 'dayEnd' | 
    'werewolvesWin' | 'villagersWin' | undefined,
  role: 'villager' | 'werewolf' | undefined,
  deceased: boolean | null | undefined
}

const initialState: PlayerState = {
  gameName: undefined,
  gamePlayers: undefined,
  id: undefined,
  name: undefined,
  status: undefined,
  role: undefined,
  deceased: undefined
}

// Slice/Reducers

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
    updatePlayerGame: (state, { payload }: PayloadAction<{ status: PlayerState['status'], players: PlayerState['gamePlayers'] }>) => {
      state.status = payload.status;
      state.gamePlayers = payload.players;
    },
    updatePlayerAttributes: (state, { payload }: PayloadAction<{ role: PlayerState['role'], deceased: PlayerState['deceased'] }>) => {
      state.role = payload.role;
      state.deceased = payload.deceased;
    }
  },
})

const { joinedGame, setStatus, updatePlayerGame, updatePlayerAttributes } = playerSlice.actions;

export default playerSlice.reducer;

// Selectors

const selectId = (state: RootState) => state.player.id;
export const selectStatus = (state: RootState) => state.player.status;
export const selectRole = (state: RootState) => state.player.role;
export const selectDeceased = (state: RootState) => state.player.deceased;

export const selectAliveVillagers = (state: RootState) =>
  state.player.gamePlayers?.filter(player => player?.role === 'villager' && player.deceased === false);

export const selectAliveAll = (state: RootState) =>
  state.player.gamePlayers?.filter(player => player?.deceased === false && player.id !== state.player.id);

// Thunks

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

  console.log('game', game);

  if (game.status !== 'waitingForPlayers') {
    console.error('game is not accepting players', gameName);
    return;
    // WBN error handling
  }

  const createPlayerResponse = await client.mutate<CreatePlayerMutation, CreatePlayerMutationVariables>({
    mutation: CREATE_PLAYER,
    variables: { input: { gameID: game.id, name: playerName }},
  });
  console.log('Created Player', createPlayerResponse);
  const playerId = createPlayerResponse?.data?.createPlayer?.id as string;
  dispatch(joinedGame({ gameName, playerName, playerId }));

  client.subscribe<OnUpdateGameForIdSubscription, OnUpdateGameForIdSubscriptionVariables>({
    query: ON_UPDATE_GAME_FOR_ID,
    variables: { id: game.id }
  }).subscribe({
    next: ({ data }) => {
      console.log('Game updated', data);
      const updatedGame = data?.onUpdateGameForId;
      if (updatedGame) {
        dispatch(updatePlayerGame({
          status: updatedGame?.status as PlayerState['status'],
          players: updatedGame?.players?.items
        }));
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

  client.subscribe<OnUpdatePlayerForIdSubscription, OnUpdatePlayerForIdSubscriptionVariables>({
    query: ON_UPDATE_PLAYER_FOR_ID,
    variables: { id: playerId }
  }).subscribe({
    next: ({ data }) => {
      console.log('Player updated', data);
      const updatedPlayer = data?.onUpdatePlayerForId;
      if (updatedPlayer) {
        dispatch(updatePlayerAttributes({
          role: updatedPlayer.role as PlayerState['role'],
          deceased: updatedPlayer.deceased
        }));
      } else {
        console.error('Error getting data from player subscription', data);
      }
    },
    error: (e) => {
      console.error(`Error on player subscription ${playerId}`, e);
    }
  });
};

export const submitWerewolfPick = (pick: string): AppThunk => async (
  dispatch,
  getState,
  client
) => {
  console.log('Submitting werewolf pick', pick);

  dispatch(setStatus('submittingWerewolfPick'));
  
  const submitWerewolfPickResponse = await client.mutate<UpdatePlayerMutation, UpdatePlayerMutationVariables>({
    mutation: UPDATE_PLAYER,
    variables: {
      input: {
        id: selectId(getState()) as string,
        pick
      }
    }
  });

  console.log('Submitted werewolf pick', submitWerewolfPickResponse);

  dispatch(setStatus('submittedWerewolfPick'));
};

export const submitVillagerPick = (pick: string): AppThunk => async (
  dispatch,
  getState,
  client
) => {
  console.log('Submitting villager pick', pick);

  dispatch(setStatus('submittingVilllagerPick'));
  
  const submitVillagerPickResponse = await client.mutate<UpdatePlayerMutation, UpdatePlayerMutationVariables>({
    mutation: UPDATE_PLAYER,
    variables: {
      input: {
        id: selectId(getState()) as string,
        pick
      }
    }
  });

  console.log('Submitted villager pick', submitVillagerPickResponse);

  dispatch(setStatus('submittedVillagerPick'));
};
