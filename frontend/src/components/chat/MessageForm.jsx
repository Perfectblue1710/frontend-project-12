import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { addMessage } from '../../slices/messagesSlice';
import { messagesAPI } from '../../services/api';

const MessageForm = () => {
  const { t } = useTranslation();
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
      const response = await messagesAPI.sendMessage({
        channelId: currentChannelId,
        body: messageText,
      });
      
      dispatch(addMessage(response.data));
      setMessage('');
      
      if (!isConnected) {
        setError(t('chat.messageSentOffline'));
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(t('chat.sendFailed'));
      
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
          {t('chat.offlineMode')}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('chat.messagePlaceholder')}
            disabled={sending}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" variant="primary" disabled={sending}>
            {sending ? t('chat.sending') : t('chat.send')}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessageForm;
