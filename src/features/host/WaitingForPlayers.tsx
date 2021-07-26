import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlayers, startGame } from './hostSlice';

const WaitingForPlayers = () => {
  const dispatch = useDispatch();
  const players = useSelector(selectPlayers);

  return (<>
    <h2>Players:</h2>
    {Object.values(players).map(player => <div key={player.id}>{player.name}</div>)}
    <br />
    <button onClick={() => dispatch(startGame())}>Start Game</button>
  </>);
}

export default WaitingForPlayers;
