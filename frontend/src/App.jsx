import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Login from './components/Login';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { logout } from './store/authSlice';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';

const Chat = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Чат</Navbar.Brand>
          <Nav className="ms-auto">
            {isAuthenticated && (
              <Button variant="outline-light" onClick={handleLogout}>
                Выйти
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <h1>Добро пожаловать в чат!</h1>
        <p>Здесь будет ваш чат</p>
      </Container>
    </>
  );
};

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;