import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { logout } from '../store/authSlice';

const Header = () => {
  const { t } = useTranslation();
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
                {t('app.offline')}
              </Badge>
            )}
            {isConnected && (
              <Badge bg="success" className="me-3 align-self-center">
                {t('app.online')}
              </Badge>
            )}
            <Button variant="outline-light" onClick={handleLogout}>
              {t('auth.logout')}
            </Button>
          </>
        )}
      </Nav>
    </Navbar>
  );
};

export default Header;
