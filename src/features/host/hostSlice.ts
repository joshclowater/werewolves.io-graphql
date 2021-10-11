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
  OnUpdatePlayerForIdSubscription,
  OnUpdatePlayerForIdSubscriptionVariables,
  UpdatePlayerMutation,
  UpdatePlayerMutationVariables
} from "../../API";
import { createGame as createGameMutation, updateGame, updatePlayer } from "../../graphql/mutations";
import { onCreatePlayerForGame, onUpdatePlayerForId } from "../../graphql/subscriptions";
import { timeout } from '../../utils/Time';

const CREATE_GAME = gql(createGameMutation);
const UPDATE_GAME = gql(updateGame);
const ON_CREATE_PLAYER_FOR_GAME = gql(onCreatePlayerForGame);
const ON_UPDATE_PLAYER_FOR_ID = gql(onUpdatePlayerForId);
const UPDATE_PLAYER = gql(updatePlayer);

// let newPlayerForGameSubscription: ZenObservable.Subscription;
// let updatePlayerSubsctiptions: ZenObservable.Subscription[] = [];

interface HostState {
  id: string | undefined,
  name: string | undefined,
  status: 'creatingGame' | 'waitingForPlayers' | 'startingGame' | 'gameStarted' | 'nightStarted' | 'werewolvesPick' | undefined
  players: { [id: string]: Player }
}

const initialState: HostState = {
  id: undefined,
  name: undefined,
  status: undefined,
  players: {}
}

// Slice/Reducers

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
    updatePlayerAttributes: (state: HostState, { payload }: PayloadAction<{ playerId: string, role: Player['role'], pick: Player['pick'] }>) => {
      if (payload.playerId) {
        state.players[payload.playerId].role = payload.role;
        state.players[payload.playerId].pick = payload.pick;
      } else {
        throw new Error(`Could not update attributes on player: ${JSON.stringify(payload)}`);
      }
    }
  },
})

const { setStatus, createdGame, addPlayer, updatePlayerAttributes } = hostSlice.actions;

export default hostSlice.reducer;

// Selectors

const selectId = (state: RootState) => state.host.id;
export const selectStatus = (state: RootState) => state.host.status;
export const selectPlayers = (state: RootState) => state.host.players;

const selectWerewolves = (state: RootState) => Object.values(state.host.players).filter(player => player.role === 'werewolf');

// Thunks

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

  // newPlayerForGameSubscription = 
  client.subscribe<OnCreatePlayerForGameSubscription, OnCreatePlayerForGameSubscriptionVariables>({
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

  // newPlayerForGameSubscription.unsubscribe();
  // It would be nice to unsubscribe here since we no longer care about subsequent players being addded,
  // but if we do that then subsequent subscriptions to player updates close after a second :(
  
  const villagers = Object.keys(selectPlayers(getState()));
  let werewolves: string[] = [];
  let numberOfWerewolves = (villagers.length > 6) ? 2 : 1;
  
  for (numberOfWerewolves; numberOfWerewolves > 0; numberOfWerewolves--) {
    const wolf = villagers.splice(Math.floor(Math.random() * villagers.length), 1);
    werewolves = werewolves.concat(wolf);
  }

  await Promise.all(werewolves.map(async (werewolfPlayerId) => {
    console.log('Updating werewolfPlayerId as a werewolf', werewolfPlayerId);
    await client.mutate<UpdatePlayerMutation, UpdatePlayerMutationVariables>({
      mutation: UPDATE_PLAYER,
      variables: { input: { id: werewolfPlayerId, role: 'werewolf', deceased: false } }
    });

    console.log('Subscribing to werewolfPlayerId', werewolfPlayerId);
    client.subscribe<OnUpdatePlayerForIdSubscription, OnUpdatePlayerForIdSubscriptionVariables>({
      query: ON_UPDATE_PLAYER_FOR_ID,
      variables: { id: werewolfPlayerId }
    }).subscribe({
      next: ({ data }) => {
        console.log('Player updated', data);
        const updatedPlayer = data?.onUpdatePlayerForId;
        if (updatedPlayer) {
          console.log('Werewolf submitted pick', werewolfPlayerId, updatedPlayer.pick)
          dispatch(updatePlayerAttributes({
            playerId: werewolfPlayerId,
            role: updatedPlayer.role,
            pick: updatedPlayer.pick
          }));
          const status = selectStatus(getState());
          if (status === 'werewolvesPick') {
            const werewolves = selectWerewolves(getState());
            const allWerewolvesSubmittedPicks = werewolves.filter(werewolf => !werewolf.pick).length === 0;
            const allWerewolvesPicksAreTheSame = werewolves.every(
              (werewolf, i, arr) => werewolf.pick === arr[0].pick
            )
            if (allWerewolvesSubmittedPicks && allWerewolvesPicksAreTheSame) {
              console.log('TODO werewolves picked the same', werewolves[0].pick);
              // TODO next update player as deceased
            }
            // TODO next update game status to day

          }
        } else {
          console.error('Error getting data from player subscription', data);
        }
      },
      error: (e) => {
        console.error(`Error on player subscription ${werewolfPlayerId}`, e);
      }
    });
  }));

  villagers.forEach(villagerPlayerId => {
    console.log('Updating villagerPlayerId as a villager', villagerPlayerId);
    client.mutate<UpdatePlayerMutation, UpdatePlayerMutationVariables>({
      mutation: UPDATE_PLAYER,
      variables: { input: { id: villagerPlayerId, role: 'villager', deceased: false } }
    });

    // TODO later, subscribe to player updates here too
  });

  const gameId = selectId(getState()) as string;
  const startGameResponse = await client.mutate<UpdateGameMutation, UpdateGameMutationVariables>({
    mutation: UPDATE_GAME,
    variables: { input: { id: gameId, status: 'gameStarted' } }
  });
  console.log('Started game', startGameResponse);
  dispatch(setStatus('gameStarted'));

  await timeout(3); // TODO 10

  const roundStartedResponse = await client.mutate<UpdateGameMutation, UpdateGameMutationVariables>({
    mutation: UPDATE_GAME,
    variables: { input: { id: gameId, status: 'nightStarted' } }
  });
  console.log('Started night', roundStartedResponse);
  dispatch(setStatus('nightStarted'));

  await timeout(3); // TODO 5

  const werewolvesPickResponse = await client.mutate<UpdateGameMutation, UpdateGameMutationVariables>({
    mutation: UPDATE_GAME,
    variables: { input: { id: gameId, status: 'werewolvesPick' } }
  });
  console.log('Werewolves pick', werewolvesPickResponse);
  dispatch(setStatus('werewolvesPick'));
}
