import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { logError, logInfo } from './utils/rollbar';
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
          logInfo('Chat data loaded successfully');
        } catch (error) {
          console.error('Failed to load data:', error);
          logError(error, { action: 'loadChatData' });
          toast.error(t('toasts.loadError'));
          if (error.response?.status === 401) {
            toast.error(t('toasts.unauthorized'));
            dispatch(logout());
          } else if (error.code === 'ERR_NETWORK') {
            toast.error(t('toasts.networkError'));
          }
        } finally {
          dispatch(setMessagesLoading(false));
        }
      };
      
      loadData();
    }
  }, [isAuthenticated, dispatch, t]);

  useEffect(() => {
    if (channelsError) {
      logError(new Error(channelsError), { action: 'channelsLoad' });
      toast.error(t('toasts.loadError'));
    }
  }, [channelsError, t]);

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

function App() {
  useEffect(() => {
    // Логируем загрузку приложения
    logInfo('Application started', { 
      version: '1.0.0',
      environment: process.env.NODE_ENV 
    });
  }, []);

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
