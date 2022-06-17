import { useSelector } from 'react-redux';
import { selectRole, selectStatus } from './playerSlice';
import globalStyles from 'index.module.css';

const GameOver = () => {
  const status = useSelector(selectStatus);
  const role = useSelector(selectRole);

  let message;
  if ((status === 'werewolvesWin' && role === 'werewolf') || (status === 'villagersWin' && role === 'villager')) {
    message = 'You win!';
  } else {
    message = 'You lost';
  }

  return (
    <div>
      <div className={globalStyles.bottomSpace}>{message}</div>
      <button onClick={() => window.location.reload()}>
        Play again?
      </button>
    </div>
  );
}

export default GameOver;