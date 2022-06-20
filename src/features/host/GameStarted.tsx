import { useEffect } from 'react';
import roundStarted from 'assets/sounds/round-started.mp3';

const GameStarted = () => {
  useEffect(() => {
    new Audio(roundStarted).play();
  }, []);

  return <div>The round has started. Look at your device to see your role. Don't let anyone else see your role. Night will begin in ten seconds.</div>;
};

export default GameStarted;