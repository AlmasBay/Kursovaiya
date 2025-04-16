import "./footer.css";
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa'; // Подключаем иконки
import { Link } from 'react-scroll'; // Импортируем Link из react-scroll

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <Link to="main" smooth={true} duration={500} offset={-100} className="footer-link">Главная</Link>
          <Link to="about" smooth={true} duration={500} offset={-100} className="footer-link">О сайте</Link>
          <Link to="test" smooth={true} duration={500} offset={-100} className="footer-link">Тест</Link>
          <Link to="pets" smooth={true} duration={500} offset={-100} className="footer-link">Питомцы</Link>
          <Link to="gallery" smooth={true} duration={500} offset={-100} className="footer-link">Галерея</Link>
          <Link to="map" smooth={true} duration={500} offset={-100} className="footer-link">Карта</Link>
          <Link to="faq" smooth={true} duration={500} offset={-100} className="footer-link">FAQ</Link>
        </div>
        <div className="contact-info">
          <p>Контакты:</p>
          <div className="contact-icons">
            <a href="mailto:info@example.com" className="contact-item">
              <FaEnvelope /> Email
            </a>
            <a href="tel:+1234567890" className="contact-item">
              <FaPhoneAlt /> Телефон
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
