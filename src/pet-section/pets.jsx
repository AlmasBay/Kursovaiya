import React from "react";
import "./pets.css";
import ImgBackground from "./pets-background/img-background";
import Cat from "./cat/cat";
import Dog from "./dog/dog";
import Parrot from "./parrot/parrot";

const Pets = () => {
  return (
    <div id="pets" className="SecondSection">
      <ImgBackground/>
      <h1 className="title-pets">Выберите Питомца</h1>
      <div className="pets-container">
        <Cat/>
        <Dog/>
        <Parrot/>
      </div>
    </div>
  );
};

export default Pets;