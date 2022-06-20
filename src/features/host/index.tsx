import { useSelector } from 'react-redux';
import { selectStatus } from './hostSlice';
import CreateGame from './CreateGame';
import WaitingForPlayers from './WaitingForPlayers';
import DeceasedResults from './DeceasedResults';
import GameOver from './GameOver';
import GameStarted from './GameStarted';
import Night from './Night';
import WerewolvesPick from './WerewolvesPick';
import WerewolvesPickEnded from './WerewolvesPickEnded';
import globalStyles from 'index.module.css';

const Host = () => {
  const status = useSelector(selectStatus);

  let content;
  if (!status || status === 'creatingGame') {
    content = <CreateGame />;
  } else if (status === 'waitingForPlayers' || status === 'startingGame') {
    content = <WaitingForPlayers />;
  } else if (status === 'gameStarted') {
    content = <GameStarted />
  } else if (status === 'nightStarted') {
    content = <Night />;
  } else if (status === 'werewolvesPick') {
    content = <WerewolvesPick />;
  } else if (status === 'werewolvesPickEnd') {
    content = <WerewolvesPickEnded />;
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
