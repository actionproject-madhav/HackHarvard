import React from "react";
import { Link } from "react-router-dom";
import '../styles/NavbarLogo.css';

interface NavbarLogoProps {
  to: string;
}

const NavbarLogo = ({ to }: NavbarLogoProps) => {
  return (
    <Link to={to} className="navbar-logo">
      <div className="logo-icon">C</div>
      <span className="logo-text">CuraSyn <span className="logo-text-2">+</span></span>
    </Link>
  );
};

export default NavbarLogo;