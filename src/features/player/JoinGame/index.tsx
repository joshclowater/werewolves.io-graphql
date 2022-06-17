import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { joinGame } from '../playerSlice';
import globalStyles from 'index.module.css';
import styles from './index.module.css';

const AddPlayer = () => {
  const dispatch = useDispatch();
  const [gameName, setGameName] = useState('');
  const [playerName, setPlayerName] = useState('');

  return (<>
    <form
      className={styles.form}
      onSubmit={async e => {
        e.preventDefault();
        dispatch(joinGame(gameName, playerName));
      }}
    >
      <div className={globalStyles.bottomSpace}>
        Game id
        <input
          name="gameName"
          placeholder="Enter the 5-letter game id"
          value={gameName}
          onChange={e => setGameName(e.target.value)}
        />
      </div>
      <div className={globalStyles.bottomSpace}>
        Your name
        <input
          name="playerName"
          placeholder="Enter your name (max 12 characters)"
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
        />
      </div>
      <button type="submit">Join Game</button>
    </form>
  </>);
};

export default AddPlayer;