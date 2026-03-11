import { Link } from "react-router-dom";
import styles from "../pages/pageCSS/Header.module.css";

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
