import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Login from './components/Login';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { logout } from './store/authSlice';
import { setChannels, setLoading as setChannelsLoading } from './slices/channelsSlice';
import { setMessages, setLoading as setMessagesLoading, clearMessages } from './slices/messagesSlice';
import { channelsAPI, messagesAPI } from './services/api';
import useWebSocket from './hooks/useWebSocket';
import ChannelList from './components/chat/ChannelList';
import MessageList from './components/chat/MessageList';
import MessageForm from './components/chat/MessageForm';
import { Container, Row, Col, Navbar, Nav, Button, Spinner, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading: channelsLoading } = useSelector((state) => state.channels);
  const { loading: messagesLoading, isConnected } = useSelector((state) => state.messages);
  
  // Подключаем WebSocket
  useWebSocket();

  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        try {
          dispatch(setChannelsLoading(true));
          dispatch(setMessagesLoading(true));
          
          const [channelsRes, messagesRes] = await Promise.all([
            channelsAPI.getChannels(),
            messagesAPI.getMessages(),
          ]);
          
          dispatch(setChannels(channelsRes.data));
          dispatch(setMessages(messagesRes.data));
        } catch (error) {
          console.error('Failed to load data:', error);
          if (error.response?.status === 401) {
            dispatch(logout());
          }
        } finally {
          dispatch(setChannelsLoading(false));
          dispatch(setMessagesLoading(false));
        }
      };
      
      loadData();
      
      // Проверяем отложенные сообщения
      const pendingMessages = JSON.parse(localStorage.getItem('pendingMessages') || '[]');
      if (pendingMessages.length > 0 && isConnected) {
        console.log('Resending pending messages:', pendingMessages);
        // Здесь можно реализовать повторную отправку
        localStorage.removeItem('pendingMessages');
      }
    } else {
      dispatch(clearMessages());
    }
  }, [isAuthenticated, dispatch, isConnected]);

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand>
            Чат 
            {!isConnected && (
              <Badge bg="warning" className="ms-2">
                Оффлайн
              </Badge>
            )}
            {isConnected && (
              <Badge bg="success" className="ms-2">
                Онлайн
              </Badge>
            )}
          </Navbar.Brand>
          <Nav>
            <Button variant="outline-light" onClick={() => dispatch(logout())}>
              Выйти
            </Button>
          </Nav>
        </Container>
      </Navbar>
      <Container fluid className="h-100">
        <Row className="h-100">
          <Col md={3} className="bg-light border-end p-0" style={{ height: 'calc(100vh - 56px)' }}>
            <ChannelList />
          </Col>
          <Col md={9} className="p-0 d-flex flex-column" style={{ height: 'calc(100vh - 56px)' }}>
            <MessageList />
            <MessageForm />
          </Col>
        </Row>
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
              <ChatPage />
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
