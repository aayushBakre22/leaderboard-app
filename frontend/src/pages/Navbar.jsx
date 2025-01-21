import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">Name</div>
      {/* <ul className="navbar-links">
        <li>
          <NavLink to={"/leaderboard"}>Leaderboard</NavLink>
        </li>
        <li>
          <NavLink to={"/users"}>Users</NavLink>
        </li>
      </ul> */}
      <div className="navbar-links">
        <NavLink to={"/leaderboard"} className={"navbar-link"}>
          Leaderboard
        </NavLink>
        <NavLink to={"/users"} className={"navbar-link"}>
          Users
        </NavLink>
        <NavLink to={"/claims"} className={"navbar-link"}>
          Claim History
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
