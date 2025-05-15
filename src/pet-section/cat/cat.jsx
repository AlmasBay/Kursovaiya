import React, { useState } from "react";
import "../animals.css";
import cat from "../../assets/cat.png";

const Cat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const totalSections = 5;

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveSection(prev => (prev < totalSections ? prev + 1 : prev));
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveSection(prev => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div className="animal-container">
      <img 
        src={cat} 
        alt="Cat" 
        className="cat" 
        onClick={() => setIsOpen(true)} 
      />

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
            <h1 className="title-modal">Уход за кошками: Полное руководство</h1>

            <h2 className="Pre-title-modal">1. Питание</h2>
            <p className="paragraph">
              Корм должен быть сбалансированным: сухой и влажный. Вода всегда должна быть свежей.
              Нельзя давать: молоко, лук, шоколад, виноград.
            </p>
            <iframe
              className="modal-video"
              src="https://www.youtube.com/embed/TTPT9rbjjA4?si=Sb6g9nyQc_ueJwG1"
              title="Видео про Питание кошек"
              allowFullScreen
            ></iframe>

            <h2 className="Pre-title-modal">2. Лоток и гигиена</h2>
            <p className="paragraph">
              Лоток чистить 1-2 раза в день. Наполнитель менять раз в неделю. Кошки сами ухаживают за шерстью, но их можно вычесывать.
            </p>
            <iframe
              className="modal-video"
              src="https://www.youtube.com/embed/QJXEMiNcek4?si=xnungtuWFlTlVHsh"
              title="Видео про Лоток и гигиену кошек"
              allowFullScreen
            ></iframe>

            <h2 className="Pre-title-modal">3. Здоровье</h2>
            <p className="paragraph">
              Обязательная вакцинация раз в год. Глистогонка каждые 3 месяца. Регулярный осмотр у ветеринара.
            </p>
            <iframe
              className="modal-video"
              src="https://www.youtube.com/embed/3KYED8wJhRs?si=QFAqoZum8acO2QNz"
              title="Видео про Здоровье кошек"
              allowFullScreen
            ></iframe>

            <h2 className="Pre-title-modal">4. Игры и активность</h2>
            <p className="paragraph">
              Кошки должны двигаться, иначе возможны проблемы с лишним весом. Лучшие игрушки: удочки, мячики, лазер.
            </p>
            <iframe
              className="modal-video"
              src="https://www.youtube.com/embed/8ffmQl0uPc0?si=qm9b0Oa5RynOQAVa"
              title="Видео про игры для кошек"
              allowFullScreen
            ></iframe>

            <h2 className="Pre-title-modal">5. Когти и мебель</h2>
            <p className="paragraph">
              Когтеточка обязательна! Можно стричь когти специальными ножницами.
            </p>
            <iframe
              className="modal-video"
              src="https://www.youtube.com/embed/wzaB0Xvu7Sw?si=ap0_IP2xOTFzlK2z"
              title="Видео про игры для кошек"
              allowFullScreen
            ></iframe>
            
            <div className="mobile-navigation">
              <button className="mobile-nav-btn" onClick={handlePrev}>
                Назад
              </button>
              <button className="mobile-nav-btn" onClick={handleNext}>
                Вперед
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cat;