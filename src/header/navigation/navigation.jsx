import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import "./navigation.css";
import logo from "../../assets/paw.png";
import MobileNav from "./MobileNav";  
import { FaUserCircle } from "react-icons/fa";

const Navigation = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [authMode, setAuthMode] = useState(null); // 'login', 'register', 'forgot'
  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setResetSent(false);
  };

  const closeModal = () => {
    setAuthMode(null);
    setEmail('');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    // Здесь будет запрос к вашему бэкенду
    console.log('Запрос на сброс пароля для:', email);
    setResetSent(true);
  };

  if (isMobile) {
    return <MobileNav />;
  }

  return (
    <nav className="navigation">
      <div className="logo-container">
        <img src={logo} alt="Логотип" className="logo" />
        <p className="logo-text">PetCare</p>
      </div>
      
      <div className="nav-links">
        <Link to="main" smooth={true} duration={500} offset={-100} className="nav-link">Главная</Link>
        <Link to="about" smooth={true} duration={500} offset={-100} className="nav-link">О сайте</Link>
        <Link to="test" smooth={true} duration={500} offset={-100} className="nav-link">Тест</Link>
        <Link to="pets" smooth={true} duration={500} offset={-100} className="nav-link">Питомцы</Link>
        <Link to="gallery" smooth={true} duration={500} offset={-100} className="nav-link">Галерея</Link>
        <Link to="map" smooth={true} duration={500} offset={-100} className="nav-link">Карта</Link>
        <Link to="faq" smooth={true} duration={500} offset={-100} className="nav-link">FAQ</Link>
        
        <button 
          onClick={() => openAuthModal('login')} 
          className="user-icon"
          aria-label="User account"
        >
          <FaUserCircle size={24} />
        </button>
      </div>

      {/* Модальное окно входа */}
      {authMode === 'login' && (
        <div className="modal-overlay">
          <div className="auth-modal">
            <button className="close-modal" onClick={closeModal}>&times;</button>
            
            <h2>Вход</h2>
            
            <form className="auth-form">
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Имя или Email" 
                  required 
                  className="auth-input"
                />
              </div>
              
              <div className="form-group">
                <input 
                  type="password" 
                  placeholder="Пароль" 
                  required 
                  className="auth-input"
                />
              </div>
              
              <div className="forgot-password">
                <button 
                  type="button" 
                  className="forgot-btn"
                  onClick={() => setAuthMode('forgot')}
                >
                  Забыли пароль?
                </button>
              </div>
              
              <button type="submit" className="auth-submit">
                Войти
              </button>
              
              <div className="auth-switch">
                <span>Нет аккаунта? </span>
                <button 
                  type="button" 
                  className="switch-btn"
                  onClick={() => setAuthMode('register')}
                >
                  Зарегистрироваться
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно регистрации */}
      {authMode === 'register' && (
        <div className="modal-overlay">
          <div className="auth-modal">
            <button className="close-modal" onClick={closeModal}>&times;</button>
            
            <h2>Регистрация</h2>
            
            <form className="auth-form">
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Ваше имя" 
                  required 
                  className="auth-input"
                />
              </div>
              
              <div className="form-group">
                <input 
                  type="email" 
                  placeholder="Email" 
                  required 
                  className="auth-input"
                />
              </div>
              
              <div className="form-group">
                <input 
                  type="password" 
                  placeholder="Пароль" 
                  required 
                  className="auth-input"
                />
              </div>
              
              <div className="form-group">
                <input 
                  type="password" 
                  placeholder="Повторите пароль" 
                  required 
                  className="auth-input"
                />
              </div>
              
              <button type="submit" className="auth-submit">
                Зарегистрироваться
              </button>
              
              <div className="auth-switch">
                <span>Уже есть аккаунт? </span>
                <button 
                  type="button" 
                  className="switch-btn"
                  onClick={() => setAuthMode('login')}
                >
                  Войти
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно сброса пароля */}
      {authMode === 'forgot' && (
        <div className="modal-overlay">
          <div className="auth-modal">
            <button className="close-modal" onClick={closeModal}>&times;</button>
            
            <h2>Сброс пароля</h2>
            
            {resetSent ? (
              <div className="reset-success">
                <p>Инструкции по сбросу пароля отправлены на {email}</p>
                <button 
                  className="auth-submit"
                  onClick={closeModal}
                >
                  ОК
                </button>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <input 
                    type="email" 
                    placeholder="Ваш Email" 
                    required 
                    className="auth-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <button type="submit" className="auth-submit">
                  Отправить инструкции
                </button>
                
                <div className="auth-switch">
                  <span>Вспомнили пароль? </span>
                  <button 
                    type="button" 
                    className="switch-btn"
                    onClick={() => setAuthMode('login')}
                  >
                    Войти
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;