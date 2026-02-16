import { Link } from "react-router";
import styles from "../UI/Header.module.css";

function Header(props) {
  // Properties

  // Hooks

  // Context

  // Methods

  // View
  return (
    <header className={styles.header}>
      <Link to="/">{/* <h1 className={styles.TitleLogo}></h1> */}</Link>
    </header>
  );
}

export default Header;
