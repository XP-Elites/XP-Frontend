import { NavLink } from "react-router-dom";

function Navbar(props) {
  // Properties

  // Hooks

  // Context

  // Methods

  const getLinkStyle = ({ isActive }) => (isActive ? "navSelected" : null);
  // View
  return (
    <nav>
      <div className="nav-item">
        <NavLink to="/" className={getLinkStyle}>
          Home
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
