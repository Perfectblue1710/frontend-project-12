import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { deleteChannel } from '../../slices/channelsSlice';

const DeleteChannelModal = ({ show, onHide, channelId, channelName }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.channels);

  const handleDelete = async () => {
    try {
      await dispatch(deleteChannel(channelId)).unwrap();
      onHide();
    } catch (error) {
      console.error('Failed to delete channel:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Вы уверены, что хотите удалить канал <strong>#{channelName}</strong>?</p>
        <p className="text-danger">Все сообщения в этом канале будут безвозвратно удалены.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Отмена
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? 'Удаление...' : 'Удалить'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteChannelModal;
