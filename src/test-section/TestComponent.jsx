import React, { useState, useEffect } from 'react';
import "./TestComponent.css";
import cat from "../../src/assets/cat.png";
import dog from "../../src/assets/dog.png";
import parrot from "../../src/assets/parrot.png";

export default function TestComponent({ isLoggedIn }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState({ dog: 0, cat: 0, parrot: 0 });
  const [testCompleted, setTestCompleted] = useState(false);
  const [previousResult, setPreviousResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTest, setShowTest] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
  
  useEffect(() => {
    const loadResults = async () => {
      if (isLoggedIn) {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch("http://localhost:5000/api/test-results", {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.result) {
              setPreviousResult(data.result);
            }
          }
        } catch (err) {
          console.error("Ошибка загрузки результатов:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [isLoggedIn]);

  const saveTestResult = async (result) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch("http://localhost:5000/api/save-test-result", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ result })
      });
      
      if (!response.ok) {
        throw new Error("Ошибка сохранения результата");
      }
    } catch (err) {
      console.error("Ошибка сохранения:", err);
    }
  };

  const handleAnswer = (pet) => {
    const newScore = {
      ...score,
      [pet]: score[pet] + 1
    };
    setScore(newScore);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      const result = getResult(newScore);
      setTestCompleted(true);
      if (isLoggedIn) {
        saveTestResult(result);
      }
    }
  };

  const getResult = (scoreData) => {
    if (scoreData.dog > scoreData.cat && scoreData.dog > scoreData.parrot) {
      return 'dog';
    } else if (scoreData.cat > scoreData.dog && scoreData.cat > scoreData.parrot) {
      return 'cat';
    } else {
      return 'parrot';
    }
  };

  const restartTest = () => {
    setScore({ dog: 0, cat: 0, parrot: 0 });
    setQuestionIndex(0);
    setTestCompleted(false);
    setPreviousResult(null);
    setShowTest(true);
  };

  const startTest = () => {
    if (isLoggedIn) {
      setShowTest(true);
    } else {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getPetImage = (pet) => {
    switch (pet) {
      case 'dog': return dog;
      case 'cat': return cat;
      case 'parrot': return parrot;
      default: return null;
    }
  };

  const getPetName = (pet) => {
    switch (pet) {
      case 'dog': return 'Собака';
      case 'cat': return 'Кошка';
      case 'parrot': return 'Попугай';
      default: return '';
    }
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div id='test' className="TestComponent">
      <h1 className="Title-test">Пройдите тест</h1>
      <h2 className="PreTitle-test">Чтобы узнать, какой питомец вам подходит</h2>
      
      {/* Кнопка видна всегда */}
      {!showTest && !testCompleted && (
        <div className="test-start-container">
          <button onClick={startTest} className="start-test-btn">
            Открыть тест
          </button>
        </div>
      )}

      {/* Показываем предыдущий результат только для авторизованных */}
      {isLoggedIn && previousResult && !testCompleted && !showTest && (
        <div className="previous-result">
          <h3>Ваш предыдущий результат:</h3>
          <p>{getPetName(previousResult)}</p>
          <img src={getPetImage(previousResult)} alt="previous pet" className="pet-image" />
          <button onClick={restartTest} className="restart-btn">
            Пройти тест заново
          </button>
        </div>
      )}

      {/* Тест показываем только если пользователь авторизован и нажал кнопку */}
      {showTest && isLoggedIn && !testCompleted ? (
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
      ) : testCompleted && isLoggedIn ? (
        <div className="result">
          <h3>Ваш идеальный питомец: {getPetName(getResult(score))}</h3>
          <img src={getPetImage(getResult(score))} alt="pet" className="pet-image" />
          <button onClick={restartTest} className="restart-btn">Начать заново</button>
        </div>
      ) : null}

      {/* Модальное окно для незарегистрированных пользователей */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Необходима авторизация</h3>
            <p>Для прохождения теста необходимо войти в аккаунт</p>
            <button onClick={closeModal} className="modal-close-btn">Понятно</button>
          </div>
        </div>
      )}
    </div>
  );
}