import React, { useState } from 'react';
import './faq.css';
import { FaChevronDown } from 'react-icons/fa';

const faqData = [
  {
    question: "Как ухаживать за щенком в первые месяцы?",
    answer: "Обеспечьте правильное питание, визит к ветеринару, социализацию и обучение основным командам.",
  },
  {
    question: "Нужно ли купать кошку?",
    answer: "Если кошка домашняя и чистоплотная, купание не обязательно. Но при сильном загрязнении – можно.",
  },
  {
    question: "Чем кормить попугая?",
    answer: "Специальные зерновые смеси, свежие фрукты и овощи. Избегай авокадо и шоколада – они ядовиты для птиц.",
  },
  {
    question: "Как часто нужно выгуливать собаку?",
    answer: "Минимум 2-3 раза в день, особенно важно утром и вечером. Активные породы требуют больше прогулок.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section id='faq' className="faq-section">
      <h1 className="faq-title">Часто задаваемые вопросы</h1>
      <div className="faq-container">
        {faqData.map((item, index) => (
          <div className="faq-item" key={index}>
            <button onClick={() => toggleFAQ(index)}>
              <span>{item.question}</span>
              <FaChevronDown
                className={`icon ${activeIndex === index ? 'rotate' : ''}`}
              />
            </button>
            <p className={activeIndex === index ? 'show' : ''}>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
