import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { playAsync } from 'utils/Sound';
import { selectAllAlivePlayers, selectAllDeceasedPlayers, selectNewlyDeceased, selectStatus } from './hostSlice';
import everyoneOpenTheirEyes from 'assets/sounds/everyone-open-eyes.mp3';
import nobodyKilled from 'assets/sounds/nobody-killed.mp3';
import villageKilled from 'assets/sounds/village-killed.mp3';
import voteWerewolf from 'assets/sounds/vote-on-werewolf.mp3';
import werewolvesKilled from 'assets/sounds/werewolves-killed.mp3';
import globalStyles from 'index.module.css';

const DeceasedResults = () => {
  const status = useSelector(selectStatus);
  const newlyDeceased = useSelector(selectNewlyDeceased);
  const allDeceased = useSelector(selectAllDeceasedPlayers);
  const allLiving = useSelector(selectAllAlivePlayers);

  useEffect(() => {
    (async function() {
      if (status === 'day') {
        await playAsync(everyoneOpenTheirEyes);
        if (newlyDeceased) {
          await playAsync(werewolvesKilled);
        } else {
          await playAsync(nobodyKilled);
        }
        await playAsync(voteWerewolf);
      } else if (status === 'dayEnd') {
        if (newlyDeceased) {
          await playAsync(villageKilled);
        } else {
          await playAsync(nobodyKilled);
        }
      }
    })();
  }, [status, newlyDeceased]);

  const killedBy = status === 'dayEnd' ? 'villagers today' : 'werewolves last night'

  return (
    <div>
      <div className={globalStyles.bottomSpace}>
        {newlyDeceased ?
          <>
            <div>Killed by {killedBy}:</div>
            <div>{newlyDeceased}</div>
          </> :
          `Nobody was killed by ${killedBy}`}
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