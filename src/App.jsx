import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './header/header';
import FirstSection from './why-section/first-section';
import Pets from './pet-section/pets';
import Slider from './slider-section/slider';
import TestComponent from './test-section/TestComponent';
import MapSection from './map-section/map';
import Faq from './faq-section/faq';
import Footer from './footer/footer';
import PetMeals from './PetMeal/PetMeals'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    const token = localStorage.getItem('authToken');
    if (savedUserInfo && token) {
      setUserInfo(JSON.parse(savedUserInfo));
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
      <FirstSection />
      <Pets />
      <Slider />
      
      <TestComponent isLoggedIn={isLoggedIn} userInfo={userInfo} />
      <PetMeals isLoggedIn={isLoggedIn} /> 
      <Faq />
      <Footer />
      
    </>
  );
}

export default App;
