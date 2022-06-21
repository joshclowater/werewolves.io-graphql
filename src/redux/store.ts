import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import {
  ApolloClient,
  InMemoryCache,
} from '@apollo/client';
import client from 'GraphQLClient';
import host from 'features/host/hostSlice';
import player from 'features/player/playerSlice';

export const store = configureStore({
  reducer: {
    host,
    player
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: client,
      },
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  ApolloClient<InMemoryCache>,
  Action<string>
>;