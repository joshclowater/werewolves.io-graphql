import { useState } from 'react';
import LandingPage from '../landingpage';
import Host from '../host';
import Player from '../player';

const App = () => {
  const [role, setRole] = useState('');
  let content;
  if (!role) {
    content = <LandingPage setRole={setRole}/>;
  } else if (role === 'host') {
    content = <Host />;
  } else if (role === 'player') {
    content = <Player />;
  } else {
    throw new Error(`Unexpected role: ${role}`);
  }
  return content;
}

export default App;
