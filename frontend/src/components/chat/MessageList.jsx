import { useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { ListGroup } from 'react-bootstrap'

const MessageList = () => {
  const { messages } = useSelector(state => state.messages)
  const { currentChannelId, channels } = useSelector(state => state.channels)
  const messagesEndRef = useRef(null)

  const currentChannel = channels.find(ch => ch.id === currentChannelId)
  const currentMessages = messages.filter(msg => msg.channelId === currentChannelId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages])

  if (!currentChannel) return null

  return (
    <div className="h-100 d-flex flex-column">
      <div className="p-3 border-bottom">
        <h4 className="mb-0"># {currentChannel.name}</h4>
      </div>
      <ListGroup variant="flush" className="flex-grow-1 overflow-auto p-3">
        {currentMessages.length === 0 && (
          <div className="text-center text-muted mt-5">Нет сообщений. Будьте первым!</div>
        )}
        {currentMessages.map(message => (
          <ListGroup.Item key={message.id} className="border-0 px-0">
            <strong className="me-2">{message.username || 'Anonymous'}</strong>
            <span className="text-muted small">
              {message.createdAt
                ? new Date(message.createdAt).toLocaleString()
                : new Date().toLocaleString()}
            </span>
            <p className="mb-0 mt-1 text-break">{message.body}</p>
          </ListGroup.Item>
        ))}
        <div ref={messagesEndRef} />
      </ListGroup>
    </div>
  )
}

export default MessageList
