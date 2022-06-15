import { useSelector } from 'react-redux';
import { selectAllDeceasedPlayers, selectNewlyDeceased, selectStatus, selectVillagers, selectWerewolves } from './hostSlice';

const GameOver = () => {
  const status = useSelector(selectStatus);
  const newlyDeceased = useSelector(selectNewlyDeceased);
  const allDeceased = useSelector(selectAllDeceasedPlayers);
  const allVillagers = useSelector(selectVillagers);
  const allWerewolves = useSelector(selectWerewolves);

  return (
    <div>
      <div>
        {status === 'werewolvesWin'
          ? 'You could not kill the werewolves in time. Werewolves win!'
          : 'You survived and killed the werewolves. Villagers win!'}
      </div>
      <div>
        {newlyDeceased || 'Nobody'} was killed by the town today.
      </div>
      <div>
        <div>All deceased:</div>
        {allDeceased.map(player =>
          <div key={player.id}>{player.name}</div>
        )}
      </div>
      <div>
        <div>Villagers:</div>
        {allVillagers.map(player =>
          <div key={player.id}>{player.name}</div>
        )}
      </div>
      <div>
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