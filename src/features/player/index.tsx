import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus, selectRole } from './playerSlice';
import JoinGame from './JoinGame';
import Role from './Role';
import WerewolfPick from './WerewolfPick';

const Player = () => {
  const status = useSelector(selectStatus);
  const role = useSelector(selectRole);

  if (!status || status === 'joiningGame') {
    return <JoinGame />;
  } else if (status === 'waitingForGameToStart') {
    return <div>Connected. Waiting for game to start.</div>;
  } else if (status === 'gameStarted') {
    return <Role />;
  } else if (status === 'nightStarted' || (status === 'werewolvesPick' && role === 'villager')) {
    return <div>Close your eyes until you are told to open them again.</div>;
  } else if ((status === 'werewolvesPick' || status === 'submittingWerewolfPick') && role === 'werewolf') {
    return <WerewolfPick />;
  } else if (status === 'submittedWerewolfPick') {
    return <div>Submitted pick.</div>
  } else {
    throw new Error(`Unexpected. status: ${status}, role: ${role}`);
  }
}

export default Player;
