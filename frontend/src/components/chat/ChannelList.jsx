import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../slices/channelsSlice';
import { ListGroup, Button } from 'react-bootstrap';
import { Hash, Plus, Trash, Pencil } from 'react-bootstrap-icons';

const ChannelList = () => {
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !channels.length) {
    return null;
  }

  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="mb-0">Каналы</h5>
        <Button variant="outline-primary" size="sm">
          <Plus />
        </Button>
      </div>
      <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
        {channels.map((channel) => (
          <ListGroup.Item
            key={channel.id}
            action
            active={channel.id === currentChannelId}
            onClick={() => dispatch(setCurrentChannel(channel.id))}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <Hash className="me-2" />
              {channel.name}
            </div>
            {channel.id !== 1 && (
              <div>
                <Button variant="link" size="sm" className="p-0 me-2">
                  <Pencil size={14} />
                </Button>
                <Button variant="link" size="sm" className="p-0 text-danger">
                  <Trash size={14} />
                </Button>
              </div>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default ChannelList;
