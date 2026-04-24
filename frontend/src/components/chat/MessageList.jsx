import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { ListGroup, Alert } from 'react-bootstrap';

const MessageList = () => {
  const { messages, error } = useSelector((state) => state.messages);
  const { currentChannelId, channels } = useSelector((state) => state.channels);
  const messagesEndRef = useRef(null);

  const currentChannel = channels.find(ch => ch.id === currentChannelId);
  const currentMessages = messages.filter(msg => msg.channelId === currentChannelId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  if (!currentChannel) {
    return null;
  }

  return (
    <div className="h-100 d-flex flex-column">
      <div className="p-3 border-bottom">
        <h4 className="mb-0 text-truncate"># {currentChannel.name}</h4>
      </div>
      
      {error && (
        <Alert variant="warning" className="m-3">
          {error}
        </Alert>
      )}
      
      <ListGroup variant="flush" className="flex-grow-1 overflow-auto p-3">
        {currentMessages.length === 0 && (
          <div className="text-center text-muted mt-5">
            Нет сообщений. Будьте первым!
          </div>
        )}
        {currentMessages.map((message) => (
          <ListGroup.Item key={message.id} className="border-0 px-0">
            <div>
              <strong className="me-2">{message.username}</strong>
              <span className="text-muted small">
                {new Date(message.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mb-0 mt-1 text-break">{message.body}</p>
          </ListGroup.Item>
        ))}
        <div ref={messagesEndRef} />
      </ListGroup>
    </div>
  );
};

export default MessageList;
