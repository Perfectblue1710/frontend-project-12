import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel, deleteChannel } from '../../slices/channelsSlice';
import { ListGroup, Button, Alert, Dropdown } from 'react-bootstrap';
import AddChannelModal from '../modals/AddChannelModal';
import RenameChannelModal from '../modals/RenameChannelModal';
import DeleteChannelModal from '../modals/DeleteChannelModal';

const ChannelList = () => {
  const dispatch = useDispatch();
  const { channels, currentChannelId, loading, error } = useSelector((state) => state.channels);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  if (!isAuthenticated || !channels.length) {
    return null;
  }

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  const handleRename = (channel) => {
    setSelectedChannel(channel);
    setShowRenameModal(true);
  };

  const handleDelete = (channel) => {
    setSelectedChannel(channel);
    setShowDeleteModal(true);
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="mb-0">Каналы</h5>
        <Button 
          variant="outline-primary" 
          size="sm"
          onClick={() => setShowAddModal(true)}
          disabled={loading}
        >
          +
        </Button>
      </div>
      
      {error && (
        <Alert variant="danger" className="m-3">
          {typeof error === 'string' ? error : 'Ошибка при загрузке каналов'}
        </Alert>
      )}
      
      <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
        {channels.map((channel) => (
          <ListGroup.Item
            key={channel.id}
            action
            active={channel.id === currentChannelId}
            onClick={() => handleChannelClick(channel.id)}
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: 'pointer' }}
          >
            <div className="text-truncate" style={{ flex: 1 }}>
              <span className="me-2">#</span>
              {channel.name}
            </div>
            {channel.id !== 1 && (
              <Dropdown onClick={(e) => e.stopPropagation()}>
                <Dropdown.Toggle 
                  as={Button} 
                  variant="link" 
                  size="sm" 
                  className="p-0 text-muted"
                  style={{ textDecoration: 'none' }}
                >
                  ⋮
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item onClick={() => handleRename(channel)}>
                    Переименовать
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => handleDelete(channel)}
                    className="text-danger"
                  >
                    Удалить
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <AddChannelModal show={showAddModal} onHide={() => setShowAddModal(false)} />
      
      {selectedChannel && (
        <>
          <RenameChannelModal
            show={showRenameModal}
            onHide={() => {
              setShowRenameModal(false);
              setSelectedChannel(null);
            }}
            channelId={selectedChannel.id}
            currentName={selectedChannel.name}
          />
          <DeleteChannelModal
            show={showDeleteModal}
            onHide={() => {
              setShowDeleteModal(false);
              setSelectedChannel(null);
            }}
            channelId={selectedChannel.id}
            channelName={selectedChannel.name}
          />
        </>
      )}
    </div>
  );
};

export default ChannelList;
