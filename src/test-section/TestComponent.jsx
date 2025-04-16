import React, { useState } from 'react';
import "./TestComponent.css";
import cat from "../../src/assets/cat.png";
import dog from "../../src/assets/dog.png";
import parrot from "../../src/assets/parrot.png";

export default function TestComponent() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState({ dog: 0, cat: 0, parrot: 0 });
  const [testCompleted, setTestCompleted] = useState(false);

  const questions = [
    {
      question: "Как много времени вы можете уделять питомцу в день?",
      answers: [
        { text: "Много времени, люблю гулять", pet: 'dog' },
        { text: "Несколько часов, чтобы поиграть и поухаживать", pet: 'cat' },
        { text: "Я много путешествую, не слишком требую внимания", pet: 'parrot' }
      ]
    },
    {
      question: "Какое настроение вам нравится?",
      answers: [
        { text: "Энергичное и активное", pet: 'dog' },
        { text: "Спокойное и уравновешенное", pet: 'cat' },
        { text: "Веселое и необычное", pet: 'parrot' }
      ]
    },
    {
      question: "Какое пространство вам подходит для питомца?",
      answers: [
        { text: "Нужен большой двор для прогулок", pet: 'dog' },
        { text: "Уютная квартира с мягкими местами", pet: 'cat' },
        { text: "Небольшая клетка, но много внимания", pet: 'parrot' }
      ]
    },
    {
      question: "Как вы относитесь к шумным питомцам?",
      answers: [
        { text: "Ничего страшного, мне нравится активность", pet: 'dog' },
        { text: "Мне нравится тишина, но иногда люблю шум", pet: 'cat' },
        { text: "Я люблю, когда питомец поет и шумит", pet: 'parrot' }
      ]
    },
    {
      question: "Что для вас важнее в питомце?",
      answers: [
        { text: "Лояльность и компания", pet: 'dog' },
        { text: "Независимость и спокойствие", pet: 'cat' },
        { text: "Развлечения и общение", pet: 'parrot' }
      ]
    },
    {
      question: "Вы хотите питомца, который будет активным на улице?",
      answers: [
        { text: "Да, я люблю долгие прогулки на свежем воздухе", pet: 'dog' },
        { text: "Не особо, мне комфортно в помещении", pet: 'cat' },
        { text: "Я хочу, чтобы питомец был больше дома", pet: 'parrot' }
      ]
    },
    {
      question: "Насколько важен для вас уход за питомцем?",
      answers: [
        { text: "Я готов много времени уделять уходу", pet: 'dog' },
        { text: "Мне важно, чтобы питомец был независим", pet: 'cat' },
        { text: "Не требуется много времени, немного внимания", pet: 'parrot' }
      ]
    },
    {
      question: "Как вам нравится общение с питомцем?",
      answers: [
        { text: "Мне нравится, когда питомец всегда рядом", pet: 'dog' },
        { text: "Мне нравится общаться, когда захочу", pet: 'cat' },
        { text: "Мне нравится, когда питомец общается с нами необычно", pet: 'parrot' }
      ]
    },
    {
      question: "Вы любите чистоту и порядок?",
      answers: [
        { text: "Да, я люблю поддерживать порядок", pet: 'cat' },
        { text: "Часто убираться — не проблема", pet: 'dog' },
        { text: "Не переживаю о беспорядке", pet: 'parrot' }
      ]
    },
    {
      question: "Как часто вы хотите, чтобы питомец был с вами?",
      answers: [
        { text: "Постоянно, я люблю быть с питомцем", pet: 'dog' },
        { text: "Питомец должен быть независим, но иногда рядом", pet: 'cat' },
        { text: "Я люблю, когда питомец время от времени проявляет внимание", pet: 'parrot' }
      ]
    }
  ];

  const handleAnswer = (pet) => {
    setScore(prevScore => ({
      ...prevScore,
      [pet]: prevScore[pet] + 1
    }));

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setTestCompleted(true);
    }
  };

  const restartTest = () => {
    setScore({ dog: 0, cat: 0, parrot: 0 });
    setQuestionIndex(0);
    setTestCompleted(false);
  };

  const getPetImage = () => {
    if (score.dog > score.cat && score.dog > score.parrot) {
      return dog;
    } else if (score.cat > score.dog && score.cat > score.parrot) {
      return cat;
    } else {
      return parrot;
    }
  };

  return (
    <div id='test' className="TestComponent">
      <h1 className="Title-test">Пройдите тест</h1>
      <h2 className="PreTitle-test">Чтобы узнать, какой питомец вам подходит</h2>
      {!testCompleted ? (
        <div className="Test">
          <div className="question-container">
            <h3>{questions[questionIndex].question}</h3>
            <div className="answer-buttons">
              {questions[questionIndex].answers.map((answer, index) => (
                <button key={index} onClick={() => handleAnswer(answer.pet)} className="answer-btn">
                  {answer.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="result">
          <h3>Ваш идеальный питомец:   
            {score.dog > score.cat && score.dog > score.parrot ? '   Собака' : 
            score.cat > score.dog && score.cat > score.parrot ? '   Кошка' : '   Попугай'}
          </h3>
          <img src={getPetImage()} alt="pet" className="pet-image" />
          <button onClick={restartTest} className="restart-btn">Начать заново</button>
        </div>
      )}
    </div>
  );
}
