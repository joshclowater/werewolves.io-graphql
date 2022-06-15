import { useSelector } from 'react-redux';
import { selectStatus } from './hostSlice';
import CreateGame from './CreateGame';
import WaitingForPlayers from './WaitingForPlayers';
import DeceasedResults from './DeceasedResults';
import GameOver from './GameOver';

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
  } else if (status === 'werewolvesPickEnd') {
    return <div>Werewolves close your eyes. Night will continue in five seconds.</div>;
  } else if (status === 'day' || status === 'dayEndPending' || status === 'dayEnd') {
    return <DeceasedResults />;
  } else if (status === 'werewolvesWin' || status === 'villagersWin') {
    return <GameOver />;
  }
  return <div>Unexpected status: {status}</div>;
}

export default Host;
