import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../slices/channelsSlice';
import { ListGroup } from 'react-bootstrap';
const ChannelList = () => {
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return null;

  let displayChannels = channels;

  if (!displayChannels || displayChannels.length === 0) {
    displayChannels = [{ id: 1, name: 'general' }];
  } else if (!displayChannels.some((ch) => ch.name === 'general')) {
    displayChannels = [{ id: 1, name: 'general' }, ...displayChannels];
  }
  return (
    <div className="h-100 d-flex flex-column">
      <div className="p-3 border-bottom">
        <h5>Каналы</h5>
      </div>

      <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
        {displayChannels.map((channel) => (
          <ListGroup.Item
            key={channel.id}
            as="button"
            action
            active={channel.id === currentChannelId}
            onClick={() => dispatch(setCurrentChannel(channel.id))}
            style={{ cursor: 'pointer' }}
          >

            {channel.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default ChannelList;
