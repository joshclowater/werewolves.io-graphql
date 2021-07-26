import React, { useState } from 'react';
import {
  useLazyQuery,
  useMutation,
  gql
} from "@apollo/client";
import {
  CreatePlayerMutation,
  CreatePlayerMutationVariables,
  ListGamesQuery,
  ListGamesQueryVariables,
} from "../../API";
import { listGames } from "../../graphql/queries";
import { createPlayer } from "../../graphql/mutations";

const CREATE_PLAYER = gql(createPlayer);
const LIST_GAMES = gql(listGames);

const AddPlayer = () => {
  const [gameName, setGameName] = useState('');
  const [playerName, setPlayerName] = useState('');

  const [createPlayer] = useMutation<CreatePlayerMutation, CreatePlayerMutationVariables>(CREATE_PLAYER);
  const [listGames] = useLazyQuery<ListGamesQuery, ListGamesQueryVariables>(
    LIST_GAMES,
    {
      onCompleted: async (data) => {
        console.log('Got game', data);
        const games = data?.listGames?.items;
        if (games?.length && games[0]) {
          if (games.length === 1) {
            const game = games[0];
            const response = await createPlayer({
              variables: { input: { gameID: game.id, name: playerName }},
            });
            console.log('Created Player', response);
          } else {
            console.warn('Multiple games with the same name exist', gameName);
          }
        } else {
          console.warn('Could not find game with name', gameName);
          // TODO error handling
        }
      }
    }
  );

  return (<>
    <h2>Join Game</h2>
    <form
      onSubmit={async e => {
        e.preventDefault();
        console.log('Searching for game', gameName);
        await listGames({
          variables: { filter: { name: { eq: gameName }}}
        });
      }}
    >
      <input
        name="gameName"
        placeholder="Game Name"
        value={gameName}
        onChange={e => setGameName(e.target.value)}
      />
      <input
        name="playerName"
        placeholder="Player Name"
        value={playerName}
        onChange={e => setPlayerName(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
    {/* {error ? <p>Oh no! {error.message}</p> : null}
    {data?.createGame ? <p>Saved!</p> : null} */}
  </>);
};

export default AddPlayer;