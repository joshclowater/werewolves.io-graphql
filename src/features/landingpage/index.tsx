import logo from 'assets/images/wolf.svg';
import styles from './index.module.css';

const LandingPage = ({ setRole }: { setRole: Function }) => {
  return (
    <div className={styles.App}>
      <img src={logo} alt="Werewolf logo" className={styles.Logo} />
      <h1>Werewolves</h1>
      <div className={styles.Buttons}>
        <button onClick={() => setRole('host')} className={styles.Button}>
          Start Game
        </button>
        <button onClick={() => setRole('player')} className={styles.Button}>
          Join Game
        </button>
      </div>
      <div className={styles.Footer}>
        {'Icons made by '}
        <a
          href="https://www.flaticon.com/authors/roundicons"
          title="Roundicons"
        >
          Roundicons
        </a>
        {' from '}
        <a href="https://www.flaticon.com/" title="Flaticon">
          www.flaticon.com
        </a>
        {' are licensed by '}
        <a
          href="http://creativecommons.org/licenses/by/3.0/"
          title="Creative Commons BY 3.0"
        >
          CC 3.0 BY
        </a>
        .
      </div>
    </div>
  );
}

export default LandingPage;
