import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../slices/channelsSlice';

const ChannelList = () => {
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) return null;


  return (
    <div style={{ padding: '1rem' }}>
      <button
        onClick={() => dispatch(setCurrentChannel(1))}
        style={{
          background: currentChannelId === 1 ? '#0d6efd' : '#e9ecef',
          color: currentChannelId === 1 ? 'white' : 'black',
          border: '1px solid #ced4da',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        general
      </button>
    </div>
  );
};

export default ChannelList;
