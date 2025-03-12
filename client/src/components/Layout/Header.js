import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  // ! JSX START
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <NavLink to={"/"} className="nav-link">
          Product
        </NavLink>
        <NavLink to={"/cart"} className="nav-link">
          Cart
        </NavLink>
      </nav>
    </>
  );
};

export default Header;
