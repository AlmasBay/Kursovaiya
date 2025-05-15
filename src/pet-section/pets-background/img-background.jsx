import React from "react";
import imgbackground from "../../assets/pet-background.jpg";
import "./img-background.css";

const ImgBackground = () => {
  return (
    <div className="background-container">
      <img src={imgbackground} alt="Pet Background" className="background-image" />
    </div>
  );
};

export default ImgBackground;