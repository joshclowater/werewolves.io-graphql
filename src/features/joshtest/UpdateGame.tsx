import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import {
  UpdateGameMutation,
  UpdateGameMutationVariables
} from "../../API";
// import { listGames } from "../graphql/queries";
import { updateGame } from "../../graphql/mutations";

const UPDATE_GAME = gql(updateGame);
// const LIST_GAMES = gql(listGames);

const UpdateGame = () => {
  const [gameName, setGameName] = useState('');

  const [updateGame, { error, data }] = useMutation<UpdateGameMutation, UpdateGameMutationVariables>(UPDATE_GAME);

  return (<>
    <h2>Update Game</h2>
    <form
      onSubmit={async e => {
        e.preventDefault();
        const response = await updateGame({
          variables: { input: {
            id: 'ea44f702-8c07-4a04-97c2-f933df526483',
            name: gameName,
            status: 'creatingGame'
          }},
          // refetchQueries: [{ query: LIST_GAMES }]
        });
        console.log('Updated game', response);
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
    {data?.updateGame ? <p>Saved!</p> : null}
  </>);
}

export default UpdateGame;