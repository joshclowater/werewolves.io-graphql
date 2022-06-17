import { useSelector } from 'react-redux';
import { selectAllAlivePlayers, selectAllDeceasedPlayers, selectNewlyDeceased, selectStatus } from './hostSlice';
import globalStyles from 'index.module.css';

const DeceasedResults = () => {
  const status = useSelector(selectStatus);
  const newlyDeceased = useSelector(selectNewlyDeceased);
  const allDeceased = useSelector(selectAllDeceasedPlayers);
  const allLiving = useSelector(selectAllAlivePlayers);

  return (
    <div>
      <div className={globalStyles.bottomSpace}>
        <div>Killed by {status === 'dayEnd' ? 'villagers today' : 'werewolves last night'}:</div>
        <div>{newlyDeceased}</div>
      </div>
      {allDeceased.length > 1 &&
        <div className={globalStyles.bottomSpace}>
          <div>All deceased villagers:</div>
          {allDeceased.map(player =>
            <div key={player.id}>{player.name}</div>
          )}
        </div>}
      <div className={globalStyles.bottomSpace}>
        <div>All remaining living villagers:</div>
        {allLiving.map(player =>
          <div key={player.id}>{player.name}</div>
        )}
      </div>
      {(status === 'day' || status === 'dayEndPending') &&
        <div>
          {`All remaining living members of the village can discuss who they think the werewolf is. 
            Vote on who you think is a werewolf.
            The member of the village with the most votes will be killed.`}
        </div>}
    </div>
  );
}

export default DeceasedResults;