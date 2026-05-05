import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ListGroup, Alert } from 'react-bootstrap';
import { filterProfanity, containsProfanity } from '../../utils/profanityFilter';

const MessageList = () => {
  const { t } = useTranslation();
  const { messages, error } = useSelector((state) => state.messages);
  const { currentChannelId, channels } = useSelector((state) => state.channels);
  const messagesEndRef = useRef(null);

  const currentChannel = channels.find(ch => ch.id === currentChannelId);
  const currentMessages = messages.filter(msg => msg.channelId === currentChannelId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  if (!currentChannel) return null;

  const renderMessage = (message) => {
    const hasProfanity = containsProfanity(message.body);
    const filteredBody = filterProfanity(message.body, '*');
    return (
      <div>
        <strong className="me-2">{message.username}</strong>
        <span className="text-muted small">
          {new Date(message.createdAt).toLocaleString()}
        </span>
        <p className="mb-0 mt-1 text-break">
          {filteredBody}
          {hasProfanity && (
            <span className="badge bg-warning text-dark ms-2" style={{ fontSize: '0.7rem' }}>
              Отфильтровано
            </span>
          )}
        </p>
      </div>
    );
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div className="p-3 border-bottom">
        <h4 className="mb-0 text-truncate"># {currentChannel.name}</h4>
      </div>
      {error && <Alert variant="warning" className="m-3">{error}</Alert>}
      <ListGroup variant="flush" className="flex-grow-1 overflow-auto p-3">
        {currentMessages.length === 0 && (
          <div className="text-center text-muted mt-5">{t('chat.noMessages')}</div>
        )}
        {currentMessages.map((message) => (
          <ListGroup.Item key={message.id} className="border-0 px-0">
            {renderMessage(message)}
          </ListGroup.Item>
        ))}
        <div ref={messagesEndRef} />
      </ListGroup>
    </div>
  );
};

export default MessageList;
