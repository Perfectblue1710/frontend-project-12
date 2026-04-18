import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import NotFound from './components/NotFound';

const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>Добро пожаловать в чат!</h1>
  </div>
);

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;