import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Modal, Button, Alert } from 'react-bootstrap'
import { deleteChannel } from '../../slices/channelsSlice'

const DeleteChannelModal = ({ show, onHide, channelId, channelName }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { loading, error } = useSelector(state => state.channels)

  const handleDelete = async () => {
    try {
      await dispatch(deleteChannel(channelId)).unwrap()
      onHide()
    }
    catch (error) {
      console.error('Failed to delete channel:', error)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.deleteChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {typeof error === 'string' ? error : t('errors.serverError')}
          </Alert>
        )}
        <p>
          {t('chat.deleteConfirmation')}
          {' '}
          <strong>#{channelName}</strong>
          ?
        </p>
        <p className="text-danger">{t('chat.deleteWarning')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          {t('chat.cancel')}
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? t('chat.deleting') : t('chat.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteChannelModal