import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { addMessage } from '../../slices/messagesSlice';
import { messagesAPI } from '../../services/api';
import { containsProfanity, filterProfanity } from '../../utils/profanityFilter';

const MessageForm = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [profanityWarning, setProfanityWarning] = useState(false);
  const dispatch = useDispatch();
  const { currentChannelId } = useSelector((state) => state.channels);
  const { isConnected } = useSelector((state) => state.messages);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || sending) return;

    let messageText = trimmed;
    if (containsProfanity(messageText)) {
      setProfanityWarning(true);
      const filtered = filterProfanity(messageText, '*');
      const ok = window.confirm(`Сообщение содержит нецензурные слова.\nОтфильтрованный вариант: "${filtered}"\nОтправить?`);
      if (!ok) return;
      messageText = filtered;
      toast.info('Сообщение отфильтровано');
    }
    setProfanityWarning(false);
    setSending(true);
    setError(null);
    try {
      const response = await messagesAPI.sendMessage({
        channelId: currentChannelId,
        body: messageText,
      });
      dispatch(addMessage(response.data));
      setMessage('');
      toast.success(t('toasts.messageSent'));
      if (!isConnected) {
        setError(t('chat.messageSentOffline'));
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error(err);
      setError(t('chat.sendFailed'));
      toast.error(t('toasts.messageError'));
      const pending = JSON.parse(localStorage.getItem('pendingMessages') || '[]');
      pending.push({ channelId: currentChannelId, body: messageText, timestamp: Date.now() });
      localStorage.setItem('pendingMessages', JSON.stringify(pending));
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setMessage(val);
    setProfanityWarning(containsProfanity(val));
  };

  return (
    <div className="p-3 border-top">
      {error && (
        <Alert variant="warning" className="mb-3" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {profanityWarning && (
        <Alert variant="warning" className="mb-3">
          ⚠️ Обнаружены нецензурные слова. Они будут отфильтрованы при отправке.
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
          aria-label="Новое сообщение"
            value={message}
            onChange={handleChange}
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
