import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../slices/channelsSlice';
import { ListGroup } from 'react-bootstrap';

const ChannelList = () => {
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) return null;

  // Если каналов нет – показываем хотя бы general
  const displayChannels = channels.length > 0 ? channels : [{ id: 1, name: 'general' }];

  return (
    <div className="h-100 d-flex flex-column">
      <div className="p-3 border-bottom">
        <h5>Каналы</h5>
      </div>
      <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
        {displayChannels.map((ch) => (
          <ListGroup.Item
            key={ch.id}
            action
            active={ch.id === currentChannelId}
            onClick={() => dispatch(setCurrentChannel(ch.id))}
          >
            # {ch.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default ChannelList;
