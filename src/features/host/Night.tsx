import { useEffect } from 'react';
import night from 'assets/sounds/night.mp3';

const Night = () => {
  useEffect(() => {
    new Audio(night).play();
  }, []);

  return <div>Everyone close their eyes. Night will begin in five seconds.</div>;
};

export default Night;