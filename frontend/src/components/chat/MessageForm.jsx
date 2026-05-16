import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { messagesAPI } from '../../services/api';
import { addMessage } from '../../slices/messagesSlice';

const MessageForm = () => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const dispatch = useDispatch();
  const { currentChannelId } = useSelector((state) => state.channels);
  const { token } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || sending || !currentChannelId) return;

    setSending(true);

    try {
      const response = await messagesAPI.sendMessage({
        channelId: currentChannelId,
        body: message.trim(),
      });

      // ⭐ ВАЖНО: добавляем username вручную, если сервер его не вернул
      const newMessage = {
        ...response.data,
        username: response.data.username || 'admin', // или можно получить из токена
        createdAt: response.data.createdAt || new Date().toISOString(),
      };

      dispatch(addMessage(newMessage));
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-3 border-top">
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            aria-label="Новое сообщение"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение..."
            disabled={sending}
          />
          <Button type="submit" disabled={sending}>
            {sending ? 'Отправка...' : 'Отправить'}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessageForm;