import { useState } from 'react';
import './App.css';
import Host from './features/host';
import Player from './features/player';

const App = () => {
  const [role, setRole] = useState('');
  let content;
  if (!role) {
    content = (
      <>
        <h1>Werewolves</h1>
        <button onClick={() => setRole('host')}>Start Game</button>
        <button onClick={() => setRole('player')}>Join Game</button>
      </>
    );
  } else if (role === 'host') {
    content = <Host />;
  } else if (role === 'player') {
    content = <Player />;
  } else {
    throw new Error(`Unexpected role: ${role}`);
  }
  return (
    <div className="App">
      {content}
    </div>
  );
}

export default App;
