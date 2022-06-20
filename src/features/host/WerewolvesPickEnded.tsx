import { useEffect } from 'react';
import werewolvesCloseEyes from 'assets/sounds/werewolves-close-eyes.mp3';

const WerewolvesPickEnded = () => {
  useEffect(() => {
    new Audio(werewolvesCloseEyes).play();
  }, []);

  return <div>Werewolves close your eyes. Night will continue in five seconds.</div>;
};

export default WerewolvesPickEnded;