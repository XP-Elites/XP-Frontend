import { NavLink } from "react-router-dom";
import Logo from "../icons/Logo";
import styles from "../UI/Navbar.module.css";

function Navbar(props) {
  // Properties

  // Hooks

  // Context

  // Methods

  const getLinkStyle = ({ isActive }) => (isActive ? "navSelected" : null);
  // View
  return (
    <nav className={styles.barStyle}>
      <div className={styles.navItem}>
        <NavLink to="/" className={getLinkStyle}>
          <Logo />
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
