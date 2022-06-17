import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAliveAll, 
  submitVillagerPick,
} from './playerSlice';
import globalStyles from 'index.module.css';

const VillagerPick = () => {
  const dispatch = useDispatch();
  const villagers = useSelector(selectAliveAll);

  const [villagerPick, setVillagerPick] = useState('');

  return (
    <div>
      <h3>Villager Pick</h3>
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
          className={globalStyles.bottomSpace}
        >
          <option value="" disabled hidden>Select a villager to kill</option>
          {villagers?.map(villager =>
            <option key={villager?.id} value={villager?.name}>{villager?.name}</option>
          )}
        </select>
        <button type="submit" disabled={villagerPick === ''}>Submit</button>
      </form>
    </div>
  );
};

export default VillagerPick;