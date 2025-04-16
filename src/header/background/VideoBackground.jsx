import React from "react";
import background from "../../assets/background.mp4";
import "./VideoBackground.css";

const VideoBackground = () => {
  return (
    <video
      className="background-video"
      autoPlay
      loop
      muted
    >
      <source src={background} type="video/mp4" />
    </video>
 
  );
};

export default VideoBackground;
