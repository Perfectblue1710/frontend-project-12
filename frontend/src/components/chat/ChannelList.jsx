import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../slices/channelsSlice';

const ChannelList = () => {
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) return null;

  let displayChannels = channels;
  if (!displayChannels || displayChannels.length === 0) {
    displayChannels = [{ id: 1, name: 'general' }];
  } else if (!displayChannels.some(ch => ch.name === 'general')) {
    displayChannels = [{ id: 1, name: 'general' }, ...displayChannels];
  }

  return (
    <div className="h-100 d-flex flex-column">
      <div className="p-3 border-bottom">
        <h5>Каналы</h5>
      </div>
      <div className="flex-grow-1 overflow-auto">
        {displayChannels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => dispatch(setCurrentChannel(channel.id))}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.5rem 1rem',
              textAlign: 'left',
              background: channel.id === currentChannelId ? '#0d6efd' : 'transparent',
              color: channel.id === currentChannelId ? 'white' : '#212529',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            # {channel.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChannelList;
