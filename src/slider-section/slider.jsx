import React, { useEffect, useRef } from "react";
import "./slider.css";
import image1 from "../../src/assets/puppy.gif";
import image2 from "../../src/assets/cute-cat.gif";
import image3 from "../../src/assets/massage-cat.gif";
import image4 from "../../src/assets/annoy-cat.gif"; 
import image5 from "../../src/assets/catdog.gif";


import background from "../../src/assets/background-podium.jpg"

const images = [image1, image2, image3, image4, image5]; 


const Slider = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty("--quantity", images.length);
    }
  }, []);

  return (
    <div id="gallery" className="banner">
      <img  className="bg" src={background} alt="" />
      <h1 className="slider-title">Галерея</h1>
      <div className="slider" ref={sliderRef}>
        {images.map((src, index) => (
          <div className="item" key={index} style={{ "--position": index + 1 }}>
            <img src={src} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
