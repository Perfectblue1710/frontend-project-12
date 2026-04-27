import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Spinner } from 'react-bootstrap';
import Login from './components/Login';
import Signup from './components/Signup';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import { logout } from './store/authSlice';
import { fetchChannels } from './slices/channelsSlice';
import { setMessages, setLoading as setMessagesLoading } from './slices/messagesSlice';
import { messagesAPI } from './services/api';
import useWebSocket from './hooks/useWebSocket';
import ChannelList from './components/chat/ChannelList';
import MessageList from './components/chat/MessageList';
import MessageForm from './components/chat/MessageForm';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading: channelsLoading, error: channelsError } = useSelector((state) => state.channels);
  const { loading: messagesLoading } = useSelector((state) => state.messages);
  
  useWebSocket();

  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        try {
          await dispatch(fetchChannels()).unwrap();
          dispatch(setMessagesLoading(true));
          const messagesRes = await messagesAPI.getMessages();
          dispatch(setMessages(messagesRes.data));
        } catch (error) {
          console.error('Failed to load data:', error);
          if (error.response?.status === 401) {
            dispatch(logout());
          }
        } finally {
          dispatch(setMessagesLoading(false));
        }
      };
      
      loadData();
    }
  }, [isAuthenticated, dispatch]);

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (channelsError) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <h3>{t('errors.loadError')}</h3>
          <p className="text-danger">{typeof channelsError === 'string' ? channelsError : t('errors.loadError')}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            {t('errors.reload')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Container fluid className="h-100">
        <Row className="h-100">
          <Col md={3} className="bg-light border-end p-0" style={{ height: 'calc(100vh - 76px)' }}>
            <ChannelList />
          </Col>
          <Col md={9} className="p-0 d-flex flex-column" style={{ height: 'calc(100vh - 76px)' }}>
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
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
