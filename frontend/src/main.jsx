import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import rollbar from './utils/rollbar';
import App from './App';
import './i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Компонент для отображения ошибки
const FallbackUI = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="text-center">
      <h1>Что-то пошло не так 😔</h1>
      <p>Мы уже работаем над исправлением проблемы.</p>
      <button 
        className="btn btn-primary" 
        onClick={() => window.location.reload()}
      >
        Перезагрузить страницу
      </button>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RollbarProvider instance={rollbar}>
      <ErrorBoundary fallbackUI={FallbackUI}>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  </React.StrictMode>
);
