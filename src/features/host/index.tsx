import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus } from './hostSlice';
import CreateGame from './CreateGame';
import WaitingForPlayers from './WaitingForPlayers';

const Host = () => {
  const status = useSelector(selectStatus);

  if (!status || status === 'creatingGame') {
    return <CreateGame />;
  } else if (status === 'waitingForPlayers' || status === 'startingGame') {
    return <WaitingForPlayers />;
  } else if (status === 'gameStarted') {
    return <div>The round has started. Look at your device to see your role. Don't let anyone else see your role. Night will begin in ten seconds.</div>;
  } else if (status === 'nightStarted') {
    return <div>Everyone close their eyes. Night will begin in five seconds.</div>;
  } else if (status === 'werewolvesPick') {
    return <div>Werewolves open your eyes and decide who you are going to kill.</div>;
  } else {
    throw new Error(`Unexpected status: ${status}`);
  }
}

export default Host;
