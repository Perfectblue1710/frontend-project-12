import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { ListGroup } from 'react-bootstrap';

const MessageList = () => {
  const { messages } = useSelector((state) => state.messages);
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
        <h4 className="mb-0"># {currentChannel.name}</h4>
      </div>
      <ListGroup variant="flush" className="flex-grow-1 overflow-auto p-3">
        {currentMessages.map((message) => (
          <ListGroup.Item key={message.id} className="border-0 px-0">
            <strong>{message.username}</strong>
            <span className="text-muted ms-2 small">
              {new Date(message.createdAt).toLocaleTimeString()}
            </span>
            <p className="mb-0 mt-1">{message.body}</p>
          </ListGroup.Item>
        ))}
        <div ref={messagesEndRef} />
      </ListGroup>
    </div>
  );
};

export default MessageList;
