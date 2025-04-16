import React, { useState } from "react";
import "../animals.css";
import dog from "../../assets/dog.png";

const Dog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img src={dog} alt="Dog" className="dog" onClick={() => setIsOpen(true)} />

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setIsOpen(false)}>
              &times;
            </span>
            <h1 className="title-modal">Уход за собаками: Полное руководство</h1>

            <h2 className="Pre-title-modal">1. Питание</h2>
            <p className="paragraph">
              Корм должен быть сбалансированным: сухой и влажный. Вода всегда должна быть свежей.
              Нельзя давать: шоколад, виноград, лук, чеснок, кости от курицы.
            </p>
            <iframe
              className="modal-video"
              src="https://www.youtube.com/embed/i5FrlC_XGKM?si=dIIz75vv4iqXAxPJ"
              title="Видео про Питание собак"
              allowFullScreen
            ></iframe>

            <h2 className="Pre-title-modal">2. Гигиена</h2>
            <p className="paragraph">
              Купание раз в месяц с использованием специального шампуня. Регулярная чистка ушей и зубов.
            </p>
            <iframe
              className="modal-video"
              src="https://www.youtube.com/embed/P3S6unHochU?si=DgFD_HuJ_dfFoNtW"
              title="Видео про Гигиену собак"
              allowFullScreen
            ></iframe>

            <h2 className="Pre-title-modal">3. Здоровье</h2>
            <p className="paragraph">
              Вакцинация строго по графику. Регулярные осмотры у ветеринара. Обработка от паразитов каждые 3 месяца.
            </p>
            <iframe
              className="modal-video"
              src="https://www.youtube.com/embed/c0eVM67tdNM?si=We3jnAZY_9EuqbuH"
              title="Видео про Здоровье собак"
              allowFullScreen
            ></iframe>

            <h2 className="Pre-title-modal">4. Прогулки и активность</h2>
            <p className="paragraph">
              Собаки нуждаются в ежедневных прогулках и физической активности для поддержания здоровья.
            </p>
            <iframe
              className="modal-video"
              src="https://www.youtube.com/embed/EPNmS9356_k?si=n7AEHMaZ-8YzpOEC"
              title="Видео про активность собак"
              allowFullScreen
            ></iframe>

            <h2 className="Pre-title-modal">5. Дрессировка и воспитание</h2>
            <p className="paragraph">
              Собаки обучаемы и нуждаются в регулярной дрессировке. Используйте положительное подкрепление.
            </p>
            <iframe
              className="modal-video"
              src="https://www.youtube.com/embed/ckjsKev9hZI?si=4-PhX2Htw3C6lqLG"
              title="Видео про дрессировку собак"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default Dog;
