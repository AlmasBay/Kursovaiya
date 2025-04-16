import React from "react";
import "./header.css";
import Navigation from "./navigation/navigation";
import VideoBackground from "./background/VideoBackground";

const Header = () => {
  return (
    <header id="main" className="header"  >
    <div className="header-container">
    <Navigation  />
    <h1 className="quote">"Они для нас - страница в жизни, а мы для них - и есть вся жизнь."⁠⁠</h1>
    <VideoBackground />
    </div>
    </header>
  );
};

export default Header;
