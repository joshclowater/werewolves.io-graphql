import { useDispatch, useSelector } from 'react-redux';
import { selectName, selectPlayers, startGame } from '../hostSlice';
import styles from './index.module.css';

const WaitingForPlayers = () => {
  const dispatch = useDispatch();
  const gameId = useSelector(selectName);
  const players = useSelector(selectPlayers);

  return (
    <div className={styles.Wrapper}>
      <div className={styles.GameInfo}>
        <div>Your game id is</div>
        <div className={styles.GameId}>{gameId}</div>
        <div>Enter the id on additional devices to connect</div>
      </div>
      {players.length > 0 && (
        <div className={styles.GameInfo}>
          <div className={styles.PlayersHeader}>Players</div>
          {players.map(player => <div key={player.id}>{player.name}</div>)}
        </div>
      )}
      {players.length >= 4 &&
        <button onClick={() => dispatch(startGame())}>Start Game</button>}
    </div>
  );
}

export default WaitingForPlayers;
