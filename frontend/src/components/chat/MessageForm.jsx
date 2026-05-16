import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { addMessage } from '../../slices/messagesSlice';
import { messagesAPI } from '../../services/api';

const MessageForm = () => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const dispatch = useDispatch();
  const { currentChannelId } = useSelector((state) => state.channels);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {

      const response = await messagesAPI.sendMessage({
        channelId: currentChannelId,
        body: message.trim(),
      });
      
      dispatch(addMessage(response.data));
      
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