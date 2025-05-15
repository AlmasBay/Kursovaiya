import React, { useState } from "react";
import "../animals.css";
import parrot from "../../assets/parrot.png";

const Parrot = () => {
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
        src={parrot} 
        alt="Parrot" 
        className="parrot" 
        onClick={() => setIsOpen(true)} 
      />

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
            <h1 className="title-modal">Уход за попугаями: Полное руководство</h1>

            <h2 className="Pre-title-modal">1. Питание</h2>
            <p className="paragraph">
              Попугаи нуждаются в сбалансированном питании: зерновые смеси, свежие фрукты и овощи, минеральные добавки.
              Нельзя давать: авокадо, шоколад, кофе, соль.
            </p>
            <iframe
              className="modal-video"
              src="https://www.youtube.com/embed/wOvN008YapU?si=4pUgeB7oiVrAOFj9"
              title="Питание попугаев"
              allowFullScreen
            ></iframe>

            <h2 className="Pre-title-modal">2. Клетка и гигиена</h2>
            <p className="paragraph">
              Клетка должна быть просторной, с жердочками и игрушками. Чистка клетки - не реже 1 раза в неделю.
            </p>
            <iframe
              className="modal-video"
              src="https://www.youtube.com/embed/bUykcsElrUU?si=E_JdqWCn_UQfi6-4"
              title="Уход за клеткой попугая"
              allowFullScreen
            ></iframe>

            <h2 className="Pre-title-modal">3. Здоровье</h2>
            <p className="paragraph">
              Регулярные осмотры у ветеринара, правильное питание и чистота - залог здоровья попугая.
            </p>
            <iframe
              className="modal-video"
              src="https://www.youtube.com/embed/SzHUSeMqRT4?si=mNtLOVCiSwRaIbCz"
              title="Здоровье попугаев"
              allowFullScreen
            ></iframe>

            <h2 className="Pre-title-modal">4. Социальное поведение</h2>
            <p className="paragraph">
              Попугаи - социальные птицы, они требуют общения и внимания от хозяина.
            </p>
            <iframe
              className="modal-video"
              src="https://www.youtube.com/embed/MyiY-AcM06c?si=OYTksfTpTSY3yjuG"
              title="Общение с попугаем"
              allowFullScreen
            ></iframe>

            <h2 className="Pre-title-modal">5. Игры и обучение</h2>
            <p className="paragraph">
              Попугаи любят игрушки и могут обучаться различным трюкам, включая речь.
            </p>
            <iframe
              className="modal-video"
              src="https://www.youtube.com/embed/HDu4SkumW-M?si=LRWZDJTDOfKaLC_B"
              title="Игры и обучение попугая"
              allowFullScreen
            ></iframe>
            

          </div>
        </div>
      )}
    </div>
  );
};

export default Parrot;