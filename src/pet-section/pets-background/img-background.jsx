import React from "react";
import imgbackground from "../../assets/pet-background.jpg"; // Укажи расширение файла
import "./img-background.css";

const ImgBackground = () => {
  return (
    
      <img src={imgbackground} alt="Pet Background" className="background-image" />
    
  );
};

export default ImgBackground;
