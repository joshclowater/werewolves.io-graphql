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
  } else if (status === 'roundStarted') {
    return <div>TODO round started</div>;
  } else {
    throw new Error(`Unexpected status: ${status}`);
  }
}

export default Host;
