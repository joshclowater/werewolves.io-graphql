import { useSelector } from 'react-redux';
import { selectStatus, selectRole, selectDeceased } from './playerSlice';
import JoinGame from './JoinGame';
import Role from './Role';
import WerewolfPick from './WerewolfPick';
import VillagerPick from './VillagerPick';
import GameOver from './GameOver';
import globalStyles from 'index.module.css';

const Player = () => {
  const status = useSelector(selectStatus);
  const role = useSelector(selectRole);
  const deceased = useSelector(selectDeceased);

  let content;
  if (!status || status === 'joiningGame') {
    content = <JoinGame />;
  } else if (status === 'waitingForGameToStart') {
    content = <div>Connected. Waiting for game to start.</div>;
  } else if (status === 'gameStarted') {
    content = <Role />;
  } else if (status === 'villagersWin' || status === 'werewolvesWin') {
    content = <GameOver />;
  } else if (deceased) {
    content = <div>You are dead.</div>;
  } else if (status === 'nightStarted' || status === 'werewolvesPickEnd' || (role === 'villager' && status === 'werewolvesPick')) {
    content = <div>Close your eyes until you are told to open them again.</div>;
  } else if (role === 'werewolf' && (status === 'werewolvesPick' || status === 'submittingWerewolfPick')) {
    content = <WerewolfPick />;
  } else if (status === 'submittedWerewolfPick' || status === 'submittedVillagerPick') {
    content = <div>Submitted pick.</div>
  } else if (status === 'day' || status === 'submittingVilllagerPick') {
    content = <VillagerPick />;
  } else if (status === 'dayEnd') {
    content = <div>The day has ended. Showing results.</div>;
  } else {
    content = <div>Unexpected state. status: {status}, role: {role}, deceased: {deceased}</div>;
  }

  return <div className={globalStyles.CenteredScreen}>{content}</div>;
}

export default Player;
