import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Badge } from 'react-bootstrap';
import { logout } from '../store/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isConnected } = useSelector((state) => state.messages);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" className="mb-4">
      <Navbar.Brand as={Link} to="/">
        Hexlet Chat
      </Navbar.Brand>
      <Nav className="ms-auto">
        {isAuthenticated && (
          <>
            {!isConnected && (
              <Badge bg="warning" className="me-3 align-self-center">
                Оффлайн
              </Badge>
            )}
            {isConnected && (
              <Badge bg="success" className="me-3 align-self-center">
                Онлайн
              </Badge>
            )}
            <Button variant="outline-light" onClick={handleLogout}>
              Выйти
            </Button>
          </>
        )}
      </Nav>
    </Navbar>
  );
};

export default Header;
