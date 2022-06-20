import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { joinGame, selectGameError, selectNameError, selectStatus } from '../playerSlice';
import globalStyles from 'index.module.css';
import styles from './index.module.css';

const AddPlayer = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
  const gameError = useSelector(selectGameError);
  const nameError = useSelector(selectNameError);

  const [gameName, setGameName] = useState('');
  const [playerName, setPlayerName] = useState('');

  return (<>
    <form
      className={styles.form}
      onSubmit={async e => {
        e.preventDefault();
        if (!status) {
          dispatch(joinGame(gameName, playerName));
        }
      }}
    >
      <div className={globalStyles.bottomSpace}>
        Game id
        <input
          name="gameName"
          placeholder="Enter the 5-letter game id"
          maxLength={5}
          disabled={status === 'joiningGame'}
          value={gameName}
          onChange={e => setGameName(e.target.value)}
        />
        {gameError && 
          <div className={globalStyles.error}>{gameError}</div>}
      </div>
      <div className={globalStyles.bottomSpace}>
        Your name
        <input
          name="playerName"
          placeholder="Enter your name (max 12 characters)"
          maxLength={12}
          disabled={status === 'joiningGame'}
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
        />
        {nameError && 
          <div className={globalStyles.error}>{nameError}</div>}
      </div>
      <button type="submit" disabled={!gameName || !playerName || status === 'joiningGame'}>Join Game</button>
    </form>
  </>);
};

export default AddPlayer;