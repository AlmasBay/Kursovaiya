import React, { useState } from "react";
import { Link } from "react-scroll";
import "./mobile-nav.css";
import logo from "../../assets/paw.png";

const MobileNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="mobile-nav">
      <div className="mobile-header">
        <img src={logo} alt="Логотип" className="mobile-logo" />
        <p className="mobile-logo-text">PetCare</p>
        <div className="burger" onClick={toggleMenu}>
          <div className={`line ${menuOpen ? "open" : ""}`} />
          <div className={`line ${menuOpen ? "open" : ""}`} />
          <div className={`line ${menuOpen ? "open" : ""}`} />
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-menu">
          <Link to="main" smooth duration={500} offset={-80} onClick={closeMenu}>Главная</Link>
          <Link to="about" smooth duration={500} offset={-80} onClick={closeMenu}>О сайте</Link>
          <Link to="test" smooth duration={500} offset={-80} onClick={closeMenu}>Тест</Link>
          <Link to="pets" smooth duration={500} offset={-80} onClick={closeMenu}>Питомцы</Link>
          <Link to="gallery" smooth duration={500} offset={-80} onClick={closeMenu}>Галерея</Link>
          <Link to="map" smooth duration={500} offset={-80} onClick={closeMenu}>Карта</Link>
          <Link to="faq" smooth duration={500} offset={-80} onClick={closeMenu}>FAQ</Link>
        </nav>
      )}
    </div>
  );
};

export default MobileNav;
