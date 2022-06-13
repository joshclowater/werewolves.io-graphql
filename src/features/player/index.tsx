import { useSelector } from 'react-redux';
import { selectStatus, selectRole, selectDeceased } from './playerSlice';
import JoinGame from './JoinGame';
import Role from './Role';
import WerewolfPick from './WerewolfPick';
import VillagerPick from './VillagerPick';

const Player = () => {
  const status = useSelector(selectStatus);
  const role = useSelector(selectRole);
  const deceased = useSelector(selectDeceased);

  if (!status || status === 'joiningGame') {
    return <JoinGame />;
  } else if (status === 'waitingForGameToStart') {
    return <div>Connected. Waiting for game to start.</div>;
  } else if (status === 'gameStarted') {
    return <Role />;
  } else if (deceased) {
    return <div>You are dead.</div>;;
  } else if (status === 'nightStarted' || status === 'werewolvesPickEnd' || (role === 'villager' && status === 'werewolvesPick')) {
    return <div>Close your eyes until you are told to open them again.</div>;
  } else if (role === 'werewolf' && (status === 'werewolvesPick' || status === 'submittingWerewolfPick')) {
    return <WerewolfPick />;
  } else if (status === 'submittedWerewolfPick' || status === 'submittedVillagerPick') {
    return <div>Submitted pick.</div>
  } else if (status === 'day') {
    return <VillagerPick />;
  }
  return <div>Unexpected state. status: {status}, role: {role}, deceased: {deceased}</div>;
}

export default Player;
