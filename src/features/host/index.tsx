import { useSelector } from 'react-redux';
import { selectStatus } from './hostSlice';
import CreateGame from './CreateGame';
import WaitingForPlayers from './WaitingForPlayers';
import DeceasedResults from './DeceasedResults';
import GameOver from './GameOver';
import globalStyles from 'index.module.css';

const Host = () => {
  const status = useSelector(selectStatus);

  let content;
  if (!status || status === 'creatingGame') {
    content = <CreateGame />;
  } else if (status === 'waitingForPlayers' || status === 'startingGame') {
    content = <WaitingForPlayers />;
  } else if (status === 'gameStarted') {
    content = <div>The round has started. Look at your device to see your role. Don't let anyone else see your role. Night will begin in ten seconds.</div>;
  } else if (status === 'nightStarted') {
    content = <div>Everyone close their eyes. Night will begin in five seconds.</div>;
  } else if (status === 'werewolvesPick') {
    content = <div>Werewolves open your eyes and decide who you are going to kill.</div>;
  } else if (status === 'werewolvesPickEnd') {
    content = <div>Werewolves close your eyes. Night will continue in five seconds.</div>;
  } else if (status === 'day' || status === 'dayEndPending' || status === 'dayEnd') {
    content = <DeceasedResults />;
  } else if (status === 'werewolvesWin' || status === 'villagersWin') {
    content = <GameOver />;
  } else {
    content = <div>Unexpected status: {status}</div>;
  }

  return (
    <div className={globalStyles.CenteredScreen}>
      {content}
    </div>
  );
}

export default Host;
