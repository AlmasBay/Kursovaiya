import React, { useState, useEffect } from 'react';
import "./PetMeals.css";

export default function PetMeals({ isLoggedIn }) {
  const [showComponent, setShowComponent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [meals, setMeals] = useState([]);
  const [formData, setFormData] = useState({
    meal_date: new Date().toISOString().split('T')[0],
    meal_time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    food: '',
    quantity: '',
    notes: ''
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (isLoggedIn && showComponent) {
      loadMeals();
    }
  }, [isLoggedIn, showComponent]);

  const loadMeals = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/pet-meals`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMeals(data.meals);
      }
    } catch (err) {
      console.error("Ошибка загрузки приемов пищи:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing 
        ? `http://localhost:5000/api/pet-meals/${editId}` 
        : "http://localhost:5000/api/pet-meals";

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error("Ошибка сохранения");
      }
      
      // Обновляем список после добавления/редактирования
      loadMeals();
      resetForm();
    } catch (err) {
      console.error("Ошибка:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Вы действительно хотите удалить эту запись?")) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5000/api/pet-meals/${id}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Ошибка удаления");
        }
        
        // Обновляем список после удаления
        loadMeals();
      } catch (err) {
        console.error("Ошибка удаления:", err);
      }
    }
  };

  const handleEdit = (meal) => {
    setFormData({
      meal_date: meal.meal_date,
      meal_time: meal.meal_time,
      food: meal.food,
      quantity: meal.quantity || '',
      notes: meal.notes || ''
    });
    setEditId(meal.id);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  const resetForm = () => {
    setFormData({
      meal_date: new Date().toISOString().split('T')[0],
      meal_time: new Date().toTimeString().split(' ')[0].slice(0, 5),
      food: '',
      quantity: '',
      notes: ''
    });
    setIsEditing(false);
    setEditId(null);
    setIsFormVisible(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
  };

  const openComponent = () => {
    if (isLoggedIn) {
      setShowComponent(true);
    } else {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (isLoading && showComponent && isLoggedIn) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div id="pet-meals" className="PetMealsComponent">
      <h1 className="Title-meals">Питание питомца</h1>
      <h2 className="PreTitle-meals">Отслеживайте приемы пищи вашего питомца</h2>
      
      {/* Кнопка для открытия компонента */}
      {!showComponent && (
        <div className="meals-start-container">
          <button onClick={openComponent} className="start-meals-btn">
            Открыть журнал питания
          </button>
        </div>
      )}

      {/* Компонент доступен только авторизованным пользователям */}
      {showComponent && isLoggedIn && (
        <div className="meals-content">
          {/* Кнопка для добавления записи */}
          {!isFormVisible && (
            <button 
              className="add-meal-btn"
              onClick={() => setIsFormVisible(true)}
            >
              + Добавить прием пищи
            </button>
          )}

          {/* Форма для добавления/редактирования записи */}
          {isFormVisible && (
            <div className="meal-form-container">
              <h3>{isEditing ? 'Редактировать запись' : 'Добавить прием пищи'}</h3>
              <form onSubmit={handleSubmit} className="meal-form">
                <div className="form-group">
                  <label>Дата:</label>
                  <input 
                    type="date" 
                    name="meal_date" 
                    value={formData.meal_date} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Время:</label>
                  <input 
                    type="time" 
                    name="meal_time" 
                    value={formData.meal_time} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Тип корма:</label>
                  <input 
                    type="text" 
                    name="food" 
                    value={formData.food} 
                    onChange={handleChange} 
                    placeholder="Например: сухой корм, влажный корм..." 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Количество:</label>
                  <input 
                    type="text" 
                    name="quantity" 
                    value={formData.quantity} 
                    onChange={handleChange} 
                    placeholder="Например: 100г, 1 пакетик..." 
                  />
                </div>
                
                <div className="form-group">
                  <label>Примечания:</label>
                  <textarea 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleChange} 
                    placeholder="Дополнительная информация..."
                  />
                </div>
                
                <div className="form-buttons">
                  <button type="submit" className="submit-btn">
                    {isEditing ? 'Сохранить изменения' : 'Добавить'}
                  </button>
                  <button type="button" className="cancel-btn" onClick={resetForm}>
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Список приемов пищи */}
          {meals.length > 0 ? (
            <div className="meals-list">
              <h3>История питания</h3>
              {meals.map(meal => (
                <div key={meal.id} className="meal-item">
                  <div className="meal-info">
                    <div className="meal-date-time">
                      <span className="meal-date">{formatDate(meal.meal_date)}</span>
                      <span className="meal-time">{meal.meal_time}</span>
                    </div>
                    <div className="meal-details">
                      <span className="meal-food">{meal.food}</span>
                      <span className="meal-quantity">{meal.quantity}</span>
                    </div>
                    {meal.notes && <p className="meal-notes">{meal.notes}</p>}
                  </div>
                  <div className="meal-actions">
                    <button onClick={() => handleEdit(meal)} className="edit-btn">
                      ✎
                    </button>
                    <button onClick={() => handleDelete(meal.id)} className="delete-btn">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-meals-message">
              <p>Нет записей о питании. Добавьте первый прием пищи.</p>
            </div>
          )}
          
          <button onClick={() => setShowComponent(false)} className="close-component-btn">
            Закрыть журнал питания
          </button>
        </div>
      )}

      {/* Модальное окно для незарегистрированных пользователей */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Необходима авторизация</h3>
            <p>Для доступа к журналу питания необходимо войти в аккаунт</p>
            <button onClick={closeModal} className="modal-close-btn">Понятно</button>
          </div>
        </div>
      )}
    </div>
  );
}