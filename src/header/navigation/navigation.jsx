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
  const [userInfo, setUserInfo] = useState(null);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    setIsMobile(window.innerWidth <= 768);
    
    const checkAuth = async () => {
      try {
        const savedUserInfo = localStorage.getItem('userInfo');
        const token = localStorage.getItem('authToken');
        
        if (savedUserInfo && token) {
          setUserInfo(JSON.parse(savedUserInfo));
          setIsLoggedIn(true);
          await verifyToken(token);
        }
      } catch (err) {
        console.error("Ошибка проверки авторизации:", err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        setIsLoggedIn(false);
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/verify-token", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          await fetchUserData(token);
        } else {
          throw new Error("Невалидный токен");
        }
      } else {
        throw new Error("Ошибка проверки токена");
      }
    } catch (err) {
      console.error("Ошибка проверки токена:", err);
      }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/user", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
        setIsLoggedIn(true);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        return data.user;
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        setIsLoggedIn(false);
        setUserInfo(null);
        throw new Error("Ошибка авторизации");
      }
    } catch (err) {
      console.error("Ошибка получения данных:", err);
    }
  };

  const openAuthModal = (mode) => {
    setAuthError('');
    if (isLoggedIn) {
      setShowAccountInfo(true);
    } else {
      setAuthMode(mode);
      setResetSent(false);
    }
  };

  const closeModal = () => {
    setAuthMode(null);
    setEmail('');
    setAuthError('');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const newPassword = prompt("Введите новый пароль:");
      if (!newPassword) return;
      
      const response = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setResetSent(true);
      } else {
        setAuthError(data.message || "Ошибка сброса пароля");
      }
    } catch (err) {
      console.error(err);
      setAuthError("Ошибка соединения");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    const formData = new FormData(e.target);
    const emailOrName = formData.get('emailOrName');
    const password = formData.get('password');

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrName, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        setUserInfo(data.user);
        setIsLoggedIn(true);
        setShowAccountInfo(true);
        closeModal();
      } else {
        setAuthError(data.message || "Ошибка входа");
      }
    } catch (err) {
      console.error("Ошибка входа:", err);
      setAuthError("Ошибка соединения");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setAuthError("Пароли не совпадают");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        setUserInfo(data.user);
        setIsLoggedIn(true);
        setShowAccountInfo(true);
        closeModal();
      } else {
        setAuthError(data.message || "Ошибка регистрации");
      }
    } catch (err) {
      console.error("Ошибка регистрации:", err);
      setAuthError("Ошибка соединения");
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch("http://localhost:5000/api/logout", {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      setUserInfo(null);
      setIsLoggedIn(false);
      setShowAccountInfo(false);
    } catch (err) {
      console.error("Ошибка выхода:", err);
    }
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (isMobile) {
    return <MobileNav 
      isLoggedIn={isLoggedIn} 
      userInfo={userInfo}
      onLoginClick={() => openAuthModal('login')}
      onLogoutClick={handleLogout}
    />;
  }

  return (
    <nav className="navigation">
      <div className="logo-container">
        <img src={logo} alt="Логотип" className="logo" />
        <p className="logo-text">PetCare</p>
      </div>

      <div className="nav-links">
        <Link to="main" smooth={true} duration={500} offset={-70} className="nav-link">Главная</Link>
        <Link to="about" smooth={true} duration={500} offset={-70} className="nav-link">О сайте</Link>
        <Link to="pets" smooth={true} duration={500} offset={-70} className="nav-link">Питомцы</Link>
        <Link to="gallery" smooth={true} duration={500} offset={-70} className="nav-link">Галерея</Link>
        <Link to="test" smooth={true} duration={500} offset={-70} className="nav-link">Тест</Link>
        <Link to="pet-meals" smooth={true} duration={500} offset={-70} className="nav-link">Дневник</Link>
        <Link to="faq" smooth={true} duration={500} offset={-70} className="nav-link">FAQ</Link>

        <div className="user-icon-container">
          <button 
            onClick={() => openAuthModal('login')} 
            className="user-icon" 
            aria-label="User account"
          >
            <FaUserCircle size={24} />
            {isLoggedIn && <span className="logged-in-dot"></span>}
          </button>
        </div>
      </div>

      {/* Модальное окно входа */}
      {authMode === 'login' && (
        <div className="modal-overlay">
          <div className="auth-modal">
            <button className="close-modal" onClick={closeModal}>&times;</button>
            <h2>Вход</h2>
            {authError && <div className="auth-error">{authError}</div>}
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <input 
                  type="text" 
                  name="emailOrName"
                  placeholder="Имя или Email" 
                  required 
                  className="auth-input" 
                />
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  name="password"
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
              <button type="submit" className="auth-submit">Войти</button>
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
            {authError && <div className="auth-error">{authError}</div>}
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="form-group">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Ваше имя" 
                  required 
                  className="auth-input" 
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  required 
                  className="auth-input" 
                />
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  name="password"
                  placeholder="Пароль" 
                  required 
                  className="auth-input" 
                />
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Повторите пароль" 
                  required 
                  className="auth-input" 
                />
              </div>
              <button type="submit" className="auth-submit">Зарегистрироваться</button>
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
            {authError && <div className="auth-error">{authError}</div>}
            {resetSent ? (
              <div className="reset-success">
                <p>Пароль успешно изменен!</p>
                <button className="auth-submit" onClick={closeModal}>ОК</button>
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
                <button type="submit" className="auth-submit">Сбросить пароль</button>
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

      {/* Модальное окно информации о пользователе */}
      {showAccountInfo && userInfo && (
        <div className="modal-overlay">
          <div className="account-info-modal">
            <button className="close-modal" onClick={() => setShowAccountInfo(false)}>
              &times;
            </button>
            <h2>Мой профиль</h2>
            <div className="account-details">
              <div className="detail-row">
                <span className="detail-label">Имя:</span>
                <span className="detail-value">{userInfo.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{userInfo.email}</span>
              </div>
              {userInfo.created_at && (
                <div className="detail-row">
                  <span className="detail-label">Дата регистрации:</span>
                  <span className="detail-value">
                    {new Date(userInfo.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            <div className="account-actions">
              <button 
                className="auth-submit logout-btn"
                onClick={handleLogout}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;