import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAliveVillagers, 
  submitWerewolfPick
} from './playerSlice';
import globalStyles from 'index.module.css';

const WerewolfPick = () => {
  const dispatch = useDispatch();
  const villagers = useSelector(selectAliveVillagers);

  const [werewolfPick, setWerewolfPick] = useState('');

  return (
    <div>
      <h3>Werewolf Pick</h3>
      <form
        onSubmit={async e => {
          e.preventDefault();
          if (werewolfPick !== '') {
            dispatch(submitWerewolfPick(werewolfPick));
          } else {
            console.warn('Cannot submit empty werewolf pick');
          }
        }}
      >
        <select
          value={werewolfPick}
          onChange={e => setWerewolfPick(e.target.value)}
          className={globalStyles.bottomSpace}
        >
          <option value="" disabled hidden>Select a villager to kill</option>
          {villagers && villagers.map(villager =>
            <option key={villager?.id} value={villager?.name}>{villager?.name}</option>
          )}
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default WerewolfPick;