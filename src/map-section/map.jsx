import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import paw from '../assets/dog-paw.png';

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // API URL - здесь можно изменить на ваш локальный сервер
  const API_URL = 'http://localhost:5000'; // Локальный сервер
  // const API_URL = 'https://petcare-api-4jfv.onrender.com'; // Удаленный сервер

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        err => {
          console.error('Ошибка геолокации:', err);
          setError('Не удалось определить ваше местоположение');
          setLoading(false);
        }
      );
    } else {
      setError('Ваш браузер не поддерживает геолокацию');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      setLoading(true);
      fetch(`${API_URL}/api/places?lat=${userLocation[0]}&lng=${userLocation[1]}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Ответ сервера: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Данные получены:', data);
          if (data.results && data.results.length > 0) {
            setStores(data.results);
          } else {
            setError('Зоомагазины не найдены в этом районе');
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Ошибка получения данных:', error);
          setError(`Ошибка при загрузке данных: ${error.message}`);
          setLoading(false);
        });
    }
  }, [userLocation]);

  // Создаем пользовательскую иконку с правильными размерами для мобильных устройств
  const customIcon = new L.Icon({
    iconUrl: paw,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });

  return (
    <div className="map-container" id="map">
      <h1 className="map-title">Зоомагазины</h1>
      <div className="map-wrapper">
        {loading && <div className="loading-spinner">Загрузка карты...</div>}
        
        {error && <p className="error-message">{error}</p>}
        
        {!loading && !error && userLocation && (
          <MapContainer 
            center={userLocation} 
            zoom={14} 
            className="map" 
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* Метка местоположения пользователя */}
            <Marker
              position={userLocation}
              icon={new L.Icon({
                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41]
              })}
            >
              <Popup>Вы здесь</Popup>
            </Marker>
            
            {/* Метки магазинов */}
            {stores.map((store, index) =>
              store.geometry && store.geometry.location ? (
                <Marker
                  key={index}
                  position={[store.geometry.location.lat, store.geometry.location.lng]}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="store-popup">
                      <strong>{store.name}</strong>
                      <p>{store.vicinity ? store.vicinity : 'Адрес не указан'}</p>
                      {store.rating && (
                        <p>Рейтинг: {store.rating} ⭐</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>
        )}
        
        {!loading && stores.length > 0 && (
          <div className="stores-list">
            <h2>Найдено зоомагазинов: {stores.length}</h2>
            {stores.slice(0, 5).map((store, index) => (
              <div key={index} className="store-item">
                <h3>{store.name}</h3>
                <p>{store.vicinity}</p>
                {store.rating && <p>Рейтинг: {store.rating} ⭐</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;