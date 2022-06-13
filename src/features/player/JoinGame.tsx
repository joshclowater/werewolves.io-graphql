import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { joinGame } from './playerSlice';

const AddPlayer = () => {
  const dispatch = useDispatch();
  const [gameName, setGameName] = useState('');
  const [playerName, setPlayerName] = useState('');

  return (<>
    <h2>Join Game</h2>
    <form
      onSubmit={async e => {
        e.preventDefault();
        dispatch(joinGame(gameName, playerName));
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
  </>);
};

export default AddPlayer;