import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import werewolvesWin from 'assets/sounds/werewolves-win.mp3';
import villagersWin from 'assets/sounds/villagers-win.mp3';
import { selectAllDeceasedPlayers, selectNewlyDeceased, selectStatus, selectVillagers, selectWerewolves } from './hostSlice';
import globalStyles from 'index.module.css';

const GameOver = () => {
  const status = useSelector(selectStatus);
  const newlyDeceased = useSelector(selectNewlyDeceased);
  const allDeceased = useSelector(selectAllDeceasedPlayers);
  const allVillagers = useSelector(selectVillagers);
  const allWerewolves = useSelector(selectWerewolves);

  useEffect(() => {
    if (status === 'werewolvesWin') {
      new Audio(werewolvesWin).play();
    } else {
      new Audio(villagersWin).play();
    }
  }, [status]);

  return (
    <div>
      <div className={globalStyles.bottomSpace}>
        {status === 'werewolvesWin'
          ? 'You could not kill the werewolves in time. Werewolves win!'
          : 'You survived and killed the werewolves. Villagers win!'}
      </div>
      <div className={globalStyles.bottomSpace}>
        {newlyDeceased || 'Nobody'} was killed by the town today.
      </div>
      <div className={globalStyles.bottomSpace}>
        <div>All deceased:</div>
        {allDeceased.map(player =>
          <div key={player.id}>{player.name}</div>
        )}
      </div>
      <div className={globalStyles.bottomSpace}>
        <div>Villagers:</div>
        {allVillagers.map(player =>
          <div key={player.id}>{player.name}</div>
        )}
      </div>
      <div className={globalStyles.bottomSpace}>
        <div>Werewolves:</div>
        {allWerewolves.map(player =>
          <div key={player.id}>{player.name}</div>
        )}
      </div>
      <button onClick={() => window.location.reload()}>
        Play again?
      </button>
    </div>
  );
}

export default GameOver;