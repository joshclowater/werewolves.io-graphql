import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAliveVillagers, 
  submitWerewolfPick
} from './playerSlice';

const AddPlayer = () => {
  const dispatch = useDispatch();
  const villagers = useSelector(selectAliveVillagers);
  const [werewolfPick, setWerewolfPick] = useState('');

  return (<>
    <h2>Select Villager To Kill</h2>
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
      >
        <option value="">Select a villager to kill</option>
        {villagers && villagers.map(villager =>
          <option key={villager?.id} value={villager?.name}>{villager?.name}</option>
        )}
      </select>
      <button type="submit">Submit</button>
    </form>
  </>);
};

export default AddPlayer;