import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus } from './playerSlice';
import JoinGame from './JoinGame';

const Player = () => {
  const status = useSelector(selectStatus);

  if (!status || status === 'joiningGame') {
    return <JoinGame />;
  } else if (status === 'waitingForGameToStart') {
    return <div>Connected. Waiting for game to start.</div>;
  } else if (status === 'roundStarted') {
    return <div>TODO make component to show role</div>;
  } else {
    throw new Error(`Unexpected status: ${status}`);
  }
}

export default Player;
