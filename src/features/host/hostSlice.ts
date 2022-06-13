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
import { modeOfArray } from '../../utils/Statistics';

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
  status: 'creatingGame' | 'waitingForPlayers' | 'startingGame' | 'gameStarted' |
    'nightStarted' | 'werewolvesPick' | 'werewolvesPickEnd' | 'day' | undefined,
  players: { [id: string]: Player },
  newlyDeceased: string | undefined,
}

const initialState: HostState = {
  id: undefined,
  name: undefined,
  status: undefined,
  players: {},
  newlyDeceased: undefined,
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
    addPlayer: (state, { payload }: PayloadAction<Player>) => {
      if (payload.id) {
        state.players[payload.id] = payload;
      } else {
        throw new Error(`Expected player to have id: ${JSON.stringify(payload)}`);
      }
    },
    updatePlayerAttributes: (state, { payload }: PayloadAction<{ playerId: string, role: Player['role'], pick: Player['pick'], deceased: Player['deceased'] }>) => {
      if (payload.playerId) {
        state.players[payload.playerId].role = payload.role;
        state.players[payload.playerId].pick = payload.pick;
        state.players[payload.playerId].deceased = payload.deceased;
      } else {
        throw new Error(`Could not update attributes on player: ${JSON.stringify(payload)}`);
      }
    },
    updateNewlyDeceased: (state, { payload }: PayloadAction<string | undefined>) => {
      state.newlyDeceased = payload;
    },
  },
})

const { setStatus, createdGame, addPlayer, updatePlayerAttributes, updateNewlyDeceased } = hostSlice.actions;

export default hostSlice.reducer;

// Selectors

const selectId = (state: RootState) => state.host.id;
export const selectStatus = (state: RootState) => state.host.status;
export const selectPlayers = (state: RootState) => Object.values(state.host.players);
export const selectPlayerIds = (state: RootState) => Object.keys(state.host.players);
export const selectNewlyDeceased = (state: RootState) => state.host.newlyDeceased;

const selectWerewolves = (state: RootState) =>
  selectPlayers(state).filter(player => player.role === 'werewolf');

const selectPlayerIdWithName = (state: RootState, playerId: string) =>
  selectPlayers(state).find(player => player.name === playerId)?.id;

const selectAllAliveVillagers = (state: RootState) =>
  selectPlayers(state).filter(player => player.deceased === false);

const selectAllAliveVillagersWhoSubmittedPicks = (state: RootState) =>
  selectAllAliveVillagers(state).filter(player => player.pick);

// Thunks

export const createGame = (name: string): AppThunk => async (
  dispatch,
  _getState,
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
  
  const villagerIds = selectPlayerIds(getState());
  let werewolfIds: string[] = [];
  let numberOfWerewolves = (villagerIds.length > 6) ? 2 : 1;
  
  for (numberOfWerewolves; numberOfWerewolves > 0; numberOfWerewolves--) {
    const wolf = villagerIds.splice(Math.floor(Math.random() * villagerIds.length), 1);
    werewolfIds = werewolfIds.concat(wolf);
  }

  await Promise.all(werewolfIds.map(async (werewolfPlayerId) => {
    console.log('Subscribing to werewolfPlayerId', werewolfPlayerId);
    client.subscribe<OnUpdatePlayerForIdSubscription, OnUpdatePlayerForIdSubscriptionVariables>({
      query: ON_UPDATE_PLAYER_FOR_ID,
      variables: { id: werewolfPlayerId }
    }).subscribe({
      next: async ({ data }) => {
        console.log('Player updated', werewolfPlayerId, data);
        const updatedPlayer = data?.onUpdatePlayerForId;
        if (!updatedPlayer) {
          console.error('Error getting data from player subscription', data);
          return;
        }
        console.log('Werewolf updated', werewolfPlayerId, updatedPlayer)
        dispatch(updatePlayerAttributes({
          playerId: werewolfPlayerId,
          role: updatedPlayer.role,
          pick: updatedPlayer.pick,
          deceased: updatedPlayer.deceased,
        }));
        const status = selectStatus(getState());
        if (status === 'startingGame') {
          console.log('initializing villager');
        } else if (status === 'werewolvesPick') {
          // TODO move this into separate thunk function
          console.log('werewolf submitted pick', werewolfPlayerId, updatedPlayer);
          const werewolves = selectWerewolves(getState());
          const allWerewolvesSubmittedPicks = werewolves.filter(werewolf => !werewolf.pick).length === 0;
          if (allWerewolvesSubmittedPicks) {
            const allWerewolvesPicksAreTheSame = werewolves.every(
              (werewolf, _i, arr) => werewolf.pick === arr[0].pick
            );
            if (allWerewolvesPicksAreTheSame) {
              const werewolvesPick = werewolves[0].pick as string;
              console.log('werewolves picked the same', werewolvesPick);
              const playerIdPicked = selectPlayerIdWithName(getState(), werewolvesPick) as string;
              await client.mutate<UpdatePlayerMutation, UpdatePlayerMutationVariables>({
                mutation: UPDATE_PLAYER,
                variables: { input: { id: playerIdPicked, deceased: true } }
              });
              dispatch(updateNewlyDeceased(werewolvesPick));
            } else {
              console.log('werewolves made separate picks, not killing anyone');
              dispatch(updateNewlyDeceased(undefined));
            }
            
            await client.mutate<UpdateGameMutation, UpdateGameMutationVariables>({
              mutation: UPDATE_GAME,
              variables: { input: { id: gameId, status: 'werewolvesPickEnd' } }
            });
            dispatch(setStatus('werewolvesPickEnd'));

            await Promise.all(werewolfIds.map(async (werewolfPlayerIdToClearPick) => {
              console.log('clearing werewolf pick', werewolfPlayerIdToClearPick);
              const clearWerewolfPickResponse = await client.mutate<UpdatePlayerMutation, UpdatePlayerMutationVariables>({
                mutation: UPDATE_PLAYER,
                variables: { input: { id: werewolfPlayerIdToClearPick, pick: null } }
              });
              console.log('cleared werewolf pick', werewolfPlayerIdToClearPick, clearWerewolfPickResponse);
            }));

            await timeout(5);

            await client.mutate<UpdateGameMutation, UpdateGameMutationVariables>({
              mutation: UPDATE_GAME,
              variables: { input: { id: gameId, status: 'day' } }
            });
            dispatch(setStatus('day'));
          } else {
            console.log('still waiting for werewolf(s) to submit pick before ending werewolf pick phase');
          }
        } else if (status === 'werewolvesPickEnd') {
          console.log('clearing werewolf pick during "werewolvesPickEnd" phase', werewolfPlayerId, updatedPlayer.pick);
        } else if (status === 'day') {
          console.log('setting villager (werewolf) pick during "day" phase', werewolfPlayerId, updatedPlayer.pick);
          dispatch(handleVillagerPick());
        } else {
          console.warn('received werewolf pick at unexpected status', status, werewolfPlayerId, updatedPlayer.pick);
        }
      },
      error: (e) => {
        console.error(`Error on player subscription ${werewolfPlayerId}`, e);
      }
    });

    console.log('Updating werewolfPlayerId as a werewolf', werewolfPlayerId);
    await client.mutate<UpdatePlayerMutation, UpdatePlayerMutationVariables>({
      mutation: UPDATE_PLAYER,
      variables: { input: { id: werewolfPlayerId, role: 'werewolf', deceased: false } }
    });
  }));

  await Promise.all(villagerIds.map(async (villagerPlayerId) => {
    console.log('Subscribing to werewolfPlayerId', villagerPlayerId);
    client.subscribe<OnUpdatePlayerForIdSubscription, OnUpdatePlayerForIdSubscriptionVariables>({
      query: ON_UPDATE_PLAYER_FOR_ID,
      variables: { id: villagerPlayerId }
    }).subscribe({
      error: (e) => {
        console.error(`Error on player subscription ${villagerPlayerId}`, e);
      },
      next: async ({ data }) => {
        console.log('Player updated', villagerPlayerId, data);
        const updatedPlayer = data?.onUpdatePlayerForId;
        if (!updatedPlayer) {
          console.error('Error getting data from player subscription', data);
          return;
        }
        console.log('Villager updated', villagerPlayerId, updatedPlayer)
        dispatch(updatePlayerAttributes({
          playerId: villagerPlayerId,
          role: updatedPlayer.role,
          pick: updatedPlayer.pick,
          deceased: updatedPlayer.deceased,
        }));
        const status = selectStatus(getState());
        if (status === 'startingGame') {
          console.log('initializing villager');
        } else if (status === 'werewolvesPick') {
          console.log('setting villager as dead', villagerPlayerId, updatedPlayer.deceased);
        } else if (status === 'day') {
          console.log('setting villager pick during "day" phase', villagerPlayerId, updatedPlayer.pick);
          dispatch(handleVillagerPick());
        } else {
          console.warn('received villager pick at unexpected status', status, villagerPlayerId, updatedPlayer.pick);
        }
      },
    });

    console.log('Updating villagerPlayerId as a villager', villagerPlayerId);
    await client.mutate<UpdatePlayerMutation, UpdatePlayerMutationVariables>({
      mutation: UPDATE_PLAYER,
      variables: { input: { id: villagerPlayerId, role: 'villager', deceased: false } }
    });
  }));

  const gameId = selectId(getState()) as string;
  const startGameResponse = await client.mutate<UpdateGameMutation, UpdateGameMutationVariables>({
    mutation: UPDATE_GAME,
    variables: { input: { id: gameId, status: 'gameStarted' } }
  });
  console.log('Started game', startGameResponse);
  dispatch(setStatus('gameStarted'));

  await timeout(5); // TODO 10

  const roundStartedResponse = await client.mutate<UpdateGameMutation, UpdateGameMutationVariables>({
    mutation: UPDATE_GAME,
    variables: { input: { id: gameId, status: 'nightStarted' } }
  });
  console.log('Started night', roundStartedResponse);
  dispatch(setStatus('nightStarted'));

  await timeout(5);

  const werewolvesPickResponse = await client.mutate<UpdateGameMutation, UpdateGameMutationVariables>({
    mutation: UPDATE_GAME,
    variables: { input: { id: gameId, status: 'werewolvesPick' } }
  });
  console.log('Werewolves pick', werewolvesPickResponse);
  dispatch(setStatus('werewolvesPick'));
}

export const handleVillagerPick = (): AppThunk => async (
  dispatch,
  getState,
  client
) => {
  const alivePlayers = selectAllAliveVillagers(getState());
  const alivePlayersWhoSubmittedPicks = selectAllAliveVillagersWhoSubmittedPicks(getState());

  if (alivePlayers.length === alivePlayersWhoSubmittedPicks.length) {
    console.log('all villagers submitted picks');
    
    const villagerPicks = alivePlayersWhoSubmittedPicks.map(player => player.pick) as string[];
    const topVillagerPicks = modeOfArray(villagerPicks);

    console.log('topVillagerPicks', topVillagerPicks);

    if (topVillagerPicks.length === 1) {
      // TODO here
    }

    // TODO next end game conditions
  } else {
    console.log('still waiting for villager(s) to submit pick before ending day');
  }
};
