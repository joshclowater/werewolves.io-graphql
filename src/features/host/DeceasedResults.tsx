import { useSelector } from 'react-redux';
import { selectNewlyDeceased, selectStatus } from './hostSlice';

const DeceasedResults = () => {
  const status = useSelector(selectStatus);
  const newlyDeceased = useSelector(selectNewlyDeceased);

  return (
    <div>
      <div>
        Killed by werewolves:
        <div>{newlyDeceased}</div>
      </div>
      <br />
      {/* TODO all deceased */}
      {/* TODO all remaining living */}
      {status === 'day' &&
        <div>
          {`All remaining living members of the village can discuss who they think the werewolf is. 
            Vote on who you think is a werewolf.
            The member of the village with the most votes will be killed.`}
        </div>}
    </div>
  );
}

export default DeceasedResults;