import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

console.log('Main.jsx - Application starting');

// Очищаем токен для тестовой среды
if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.search);
  const isTest = urlParams.get('test') === 'true' || window.location.hostname === 'localhost';
  
  if (isTest) {
    console.log('Test environment detected, clearing token');
    localStorage.removeItem('token');
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
