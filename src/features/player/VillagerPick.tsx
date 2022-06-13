import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAliveAll, 
  submitVillagerPick,
} from './playerSlice';

const VillagerPick = () => {
  const dispatch = useDispatch();
  const villagers = useSelector(selectAliveAll);

  const [villagerPick, setVillagerPick] = useState('');

  return (<>
    <h2>Select Villager To Kill</h2>
    <form
      onSubmit={async e => {
        e.preventDefault();
        if (villagerPick !== '') {
          dispatch(submitVillagerPick(villagerPick));
        } else {
          console.warn('Cannot submit empty villager pick');
        }
      }}
    >
      <select
        value={villagerPick}
        onChange={e => setVillagerPick(e.target.value)}
      >
        <option value="">Select a villager to kill</option>
        {villagers?.map(villager =>
          <option key={villager?.id} value={villager?.name}>{villager?.name}</option>
        )}
      </select>
      <button type="submit">Submit</button>
    </form>
  </>);
};

export default VillagerPick;