import { Modal, Button } from 'react-bootstrap'

const DeleteChannelModal = ({
  show,
  onHide,
  onDelete,
  loading,
  selectedChannel,
}) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>Удалить канал</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <p>
        Вы уверены, что хотите удалить канал
        {' '}
        <strong>
          #
          {selectedChannel?.name}
        </strong>
        ?
      </p>

      <p className="text-danger">
        Все сообщения в этом канале будут безвозвратно удалены.
      </p>
    </Modal.Body>

    <Modal.Footer>
      <Button
        variant="secondary"
        onClick={onHide}
      >
        Отмена
      </Button>

      <Button
        variant="danger"
        onClick={onDelete}
        disabled={loading}
      >
        Удалить
      </Button>
    </Modal.Footer>
  </Modal>
)

export default DeleteChannelModal
