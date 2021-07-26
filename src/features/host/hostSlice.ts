import { gql } from '@apollo/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk, RootState } from '../../redux/store';
import {
  Player,
  CreateGameMutation,
  CreateGameMutationVariables,
  UpdateGameMutation,
  UpdateGameMutationVariables,
  OnCreatePlayerForGameSubscription,
  OnCreatePlayerForGameSubscriptionVariables,
  UpdatePlayerMutation,
  UpdatePlayerMutationVariables
} from "../../API";
import { createGame as createGameMutation, updateGame, updatePlayer } from "../../graphql/mutations";
import { onCreatePlayerForGame } from "../../graphql/subscriptions";

const CREATE_GAME = gql(createGameMutation);
const UPDATE_GAME = gql(updateGame);
const ON_CREATE_PLAYER_FOR_GAME = gql(onCreatePlayerForGame);
const UPDATE_PLAYER = gql(updatePlayer);

let newPlayerForGameSubscription: ZenObservable.Subscription;

interface HostState {
  id: string | undefined,
  name: string | undefined,
  status: 'creatingGame' | 'waitingForPlayers' | 'startingGame' | 'roundStarted' | undefined
  players: { [id: string]: Player }
}

const initialState: HostState = {
  id: undefined,
  name: undefined,
  status: undefined,
  players: {}
}

export const hostSlice = createSlice({
  name: 'host',
  initialState,
  reducers: {
    setStatus: (state, { payload }: PayloadAction<HostState['status']>) => {
      state.status = payload;
    },
    createdGame: (state, { payload }: PayloadAction<{ id: string, name: string }>) => {
      state.id = payload.id;
      state.name = payload.name;
      state.status = 'waitingForPlayers';
    },
    addPlayer: (state: HostState, { payload }: PayloadAction<Player>) => {
      if (payload.id) {
        state.players[payload.id] = payload;
      } else {
        throw new Error(`Expected player to have id: ${JSON.stringify(payload)}`);
      }
    },
  },
})

const { setStatus, createdGame, addPlayer } = hostSlice.actions;

const selectId = (state: RootState) => state.host.id;
export const selectStatus = (state: RootState) => state.host.status;
export const selectPlayers = (state: RootState) => state.host.players;

export const createGame = (name: string): AppThunk => async (
  dispatch,
  _,
  client
) => {
  dispatch(setStatus('creatingGame'));
  const response = await client.mutate<CreateGameMutation, CreateGameMutationVariables>({
    mutation: CREATE_GAME,
    variables: { input: { name, status: 'waitingForPlayers' } }
  });
  console.log('Create game response', response);
  const game = response?.data?.createGame;
  if (game) {
    dispatch(createdGame({ id: game.id, name }));
  } else {
    console.error('Failed to create game', response);
    return;
  }

  newPlayerForGameSubscription = client.subscribe<OnCreatePlayerForGameSubscription, OnCreatePlayerForGameSubscriptionVariables>({
    query: ON_CREATE_PLAYER_FOR_GAME,
    variables: {
      gameID: game.id
    }
  }).subscribe({
    next: ({ data }) => {
      console.log('New player on game', game.id, data);
      const newPlayer = data?.onCreatePlayerForGame;
      if (newPlayer) {
        dispatch(addPlayer(newPlayer as Player))
      } else {
        console.error('Error getting player from game subscription', data);
      }
    },
    error: (err) => {
      console.error('Error on new player for game subscription', err);
    }
  });

};

export const startGame = (): AppThunk => async (
  dispatch,
  getState,
  client
) => {
  dispatch(setStatus('startingGame'));

  newPlayerForGameSubscription.unsubscribe();
  
  const villagers = Object.keys(selectPlayers(getState()));
  let werewolves: string[] = [];
  let numberOfWerewolves = (villagers.length > 6) ? 2 : 1;
  
  for (numberOfWerewolves; numberOfWerewolves > 0; numberOfWerewolves--) {
    const wolf = villagers.splice(Math.floor(Math.random() * villagers.length), 1);
    werewolves = werewolves.concat(wolf);
  }

  werewolves.forEach(werewolfPlayerId => {
    client.mutate<UpdatePlayerMutation, UpdatePlayerMutationVariables>({
      mutation: UPDATE_PLAYER,
      variables: { input: { id: werewolfPlayerId, role: 'werewolf', deceased: false } }
    });
  });

  villagers.forEach(villagerPlayerId => {
    client.mutate<UpdatePlayerMutation, UpdatePlayerMutationVariables>({
      mutation: UPDATE_PLAYER,
      variables: { input: { id: villagerPlayerId, role: 'villager', deceased: false } }
    });
  });

  // TODO subscribe to each player updates

  const gameId = selectId(getState()) as string;
  const response = await client.mutate<UpdateGameMutation, UpdateGameMutationVariables>({
    mutation: UPDATE_GAME,
    variables: { input: { id: gameId, status: 'roundStarted' } }
  });
  console.log('Started game', response);
  // XXX
  dispatch(setStatus('roundStarted'));
}

export default hostSlice.reducer;