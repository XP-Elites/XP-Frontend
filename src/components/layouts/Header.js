import { Link } from "react-router";
import "../UI/Header.css";
import Logo from "../icons/Logo";

function Header(props) {
  // Properties

  // Hooks

  // Context

  // Methods

  // View
  return (
    <header className="header">
      <p1></p1>
      <Link to="/">
        <h1 className="TitleLogo">
          <Logo />
          CodeShield
        </h1>
      </Link>
    </header>
  );
}

export default Header;
