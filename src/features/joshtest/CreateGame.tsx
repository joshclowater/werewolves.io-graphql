import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import {
  CreateGameMutation,
  CreateGameMutationVariables
} from "../../API";
// import { listGames } from "../graphql/queries";
import { createGame } from "../../graphql/mutations";

const CREATE_GAME = gql(createGame);
// const LIST_GAMES = gql(listGames);

const CreateGame = () => {
  const [gameName, setGameName] = useState('');

  const [createGame, { error, data }] = useMutation<CreateGameMutation, CreateGameMutationVariables>(CREATE_GAME);

  return (<>
    <h2>Create Game</h2>
    <form
      onSubmit={async e => {
        e.preventDefault();
        const response = await createGame({
          variables: { input: {
            name: gameName,
            status: 'creatingGame',
            expirationUnixTime: Math.floor(Date.now() / 1000) + 86400
          }},
          // refetchQueries: [{ query: LIST_GAMES }]
        });
        console.log('Created game', response);
      }}
    >
      <input
        name="gameName"
        placeholder="Game Name"
        value={gameName}
        onChange={e => setGameName(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
    {error ? <p>Oh no! {error.message}</p> : null}
    {data?.createGame ? <p>Saved!</p> : null}
  </>);
}

export default CreateGame;