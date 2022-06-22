import logo from 'assets/images/wolf.svg';
import facebookLogo from 'assets/images/f-logo.png';
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
      <div className={styles.Instructions}>
        <a href="https://www.wikihow.com/Play-Werewolf-(Party-Game)" target="_blank" rel="noopener noreferrer">
          Instructions
        </a>
      </div>
      <div className={styles.Footer}>
        <a href="https://www.facebook.com/Werewolvesio-102622542503843" target="_blank" rel="noopener noreferrer">
          <img src={facebookLogo} alt="Facebook page" className={styles.FacebookLogo} />
        </a>
        <div>
          {'Icons made by '}
          <a href="https://www.flaticon.com/authors/roundicons">
            Roundicons
          </a>
          {' from '}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
          {' are licensed by '}
          <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">
            CC 3.0 BY
          </a>
          .
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
