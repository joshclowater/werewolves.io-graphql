import { useEffect } from 'react';
import werewolvesOpenEyes from 'assets/sounds/werewolves-open-eyes.mp3';

const WerewolvesPick = () => {
  useEffect(() => {
    new Audio(werewolvesOpenEyes).play();
  }, []);

  return <div>Werewolves open your eyes and decide who you are going to kill.</div>;
};

export default WerewolvesPick;