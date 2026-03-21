import { NavLink } from "react-router-dom";
import Logo from "../icons/Logo";
import Icons from "../icons/Icons";
import styles from "../pages/pageCSS/Navbar.module.css";

function Navbar(props) {
  // Properties

  // Hooks

  // Context

  // Methods

  // const getLinkStyle = ({ isActive }) => (isActive ? styles.navSelected : null);

  // View
  return (
    <nav className={styles.barStyle}>
      {/* Logo stays at the top */}
      <div className={styles.navItemTop}>
        <NavLink to="/" className={styles.navLink}>
          <Logo />
        </NavLink>
        <NavLink to="/upload" className={styles.navLink}>
          <div className={styles.navLinkContent}>
            <Icons icon="FaCode" size={30} variant="Black" />
            <span className={styles.iconText}>Upload</span>
          </div>
        </NavLink>
      </div>
      <div className={styles.navItemTop}>
        <NavLink to="/archive" className={styles.navLink}>
          <div className={styles.navLinkContent}>
            <Icons icon="FaBoxArchive" size={30} variant="Black" />
            <span className={styles.iconText}>Archive</span>
          </div>
        </NavLink>
      </div>
      <div className={styles.navItem}>
        <NavLink to="/" className={styles.navLink}>
          <div className={styles.navLinkContent}>
            <Icons icon="MdPerson" size={40} variant="Black" />
          </div>
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
