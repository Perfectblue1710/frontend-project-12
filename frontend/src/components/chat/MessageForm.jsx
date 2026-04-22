import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { addMessage } from '../../slices/messagesSlice';
import { messagesAPI } from '../../services/api';
import { getSocket } from '../../services/socket';

const MessageForm = () => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { currentChannelId } = useSelector((state) => state.channels);
  const { isConnected } = useSelector((state) => state.messages);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    const messageText = message.trim();
    setSending(true);
    setError(null);

    try {
      // Отправляем сообщение через REST API
      const response = await messagesAPI.sendMessage({
        channelId: currentChannelId,
        body: messageText,
      });
      
      // Сообщение будет добавлено через WebSocket
      // Но для оптимизации можно добавить сразу
      dispatch(addMessage(response.data));
      setMessage('');
      
      // Если WebSocket отключен, показываем предупреждение
      if (!isConnected) {
        setError('Сообщение отправлено, но WebSocket не подключен. Новые сообщения могут не приходить в реальном времени.');
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Не удалось отправить сообщение. Проверьте соединение.');
      
      // Сохраняем сообщение в localStorage для повторной отправки
      const pendingMessages = JSON.parse(localStorage.getItem('pendingMessages') || '[]');
      pendingMessages.push({
        channelId: currentChannelId,
        body: messageText,
        timestamp: Date.now(),
      });
      localStorage.setItem('pendingMessages', JSON.stringify(pendingMessages));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-3 border-top">
      {error && (
        <Alert variant="warning" className="mb-3" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      {!isConnected && (
        <Alert variant="info" className="mb-3">
          ⚡ Работа в оффлайн режиме. Сообщения будут отправлены при восстановлении соединения.
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение..."
            disabled={sending}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" variant="primary" disabled={sending}>
            {sending ? 'Отправка...' : 'Отправить'}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessageForm;
