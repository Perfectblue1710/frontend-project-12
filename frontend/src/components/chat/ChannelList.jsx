import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setCurrentChannel } from '../../slices/channelsSlice';
import { ListGroup, Button, Alert, Dropdown } from 'react-bootstrap';
import AddChannelModal from '../modals/AddChannelModal';
import RenameChannelModal from '../modals/RenameChannelModal';
import DeleteChannelModal from '../modals/DeleteChannelModal';

const ChannelList = () => {
  const { t } = useTranslation();
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
  if (channels.length === 0) {
  return <div>Канал general</div>;
}

  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="mb-0">{t('chat.channels')}</h5>
       <Button 
  variant={channel.id === currentChannelId ? "primary" : "light"}
  onClick={() => dispatch(setCurrentChannel(channel.id))}
>
  # {channel.name}
</Button>
      </div>
      
      {error && (
        <Alert variant="danger" className="m-3">
          {typeof error === 'string' ? error : t('errors.loadError')}
        </Alert>
      )}
      
      <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
        {channels.map((channel) => (
          <ListGroup.Item
            key={channel.id}
            action
            active={channel.id === currentChannelId}
            onClick={() => dispatch(setCurrentChannel(channel.id))}
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: 'pointer' }}
          >
            <div className="text-truncate" style={{ flex: 1 }}>
              <span className="me-2">#</span>
              {channel.name}
            </div>
            {channel.id !== 1 && (
              <Dropdown>
                <Dropdown.Toggle 
                  as="div"
                  variant="link" 
                  size="sm" 
                  className="p-0 text-muted"
                  style={{ cursor: 'pointer', textDecoration: 'none' }}
                  aria-label={t('chat.channelMenu')}
                >
                  ⋮
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item onClick={() => {
                    setSelectedChannel(channel);
                    setShowRenameModal(true);
                  }}>
                    {t('chat.rename')}
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => {
                      setSelectedChannel(channel);
                      setShowDeleteModal(true);
                    }}
                    className="text-danger"
                  >
                    {t('chat.delete')}
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
