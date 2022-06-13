import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGame } from './hostSlice';

const CreateGame = () => {
  const dispatch = useDispatch();
  const [gameName, setGameName] = useState('');

  return (<>
    <h2>Create Game</h2>
    <form
      onSubmit={async e => {
        e.preventDefault();
        dispatch(createGame(gameName));
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
    {/* WBN 'creatingGame' in progress, error states */}
  </>);
}

export default CreateGame;