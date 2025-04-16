import React from 'react';
import './App.css';
import Header from './header/header';
import FirstSection from './why-section/first-section';
import Pets from './pet-section/pets';
import Slider from './slider-section/slider';
import TestComponent from './test-section/TestComponent';
import MapSection from './map-section/map';
import Faq from './faq-section/faq';
import Footer from './footer/footer';

function App() {
  
  return (
    <>
      <Header />
      <FirstSection />
      <TestComponent/>
      <Pets/>
      <Slider/>
      <MapSection/>
      <Faq/>
      <Footer/>
    </>
  );
}

export default App;
