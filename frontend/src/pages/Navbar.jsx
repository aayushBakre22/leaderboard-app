import { Link, NavLink } from "react-router-dom";
import "./styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">
        <Link to={"/"}>User Leaderboard</Link>
      </div>
      <div className="navbar-links">
        <NavLink to={"/"} className={"navbar-link"}>
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
