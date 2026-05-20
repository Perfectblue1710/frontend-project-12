import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { renameChannel } from '../../slices/channelsSlice';

const RenameChannelModal = ({ show, onHide, channelId, currentName }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels, loading } = useSelector((state) => state.channels);
  const inputRef = useRef(null);

  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [show]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('errors.usernameLength'))
      .max(20, t('errors.usernameLength'))
      .notOneOf(
        channels.filter((ch) => ch.id !== channelId).map((ch) => ch.name),
        t('errors.channelExists'),
      )
      .required(t('errors.required')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(
        renameChannel({ id: channelId, name: values.name }),
      ).unwrap();
      onHide();
    } catch (error) {
      console.error('Failed to rename channel:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: currentName }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group controlId="modal-rename-channel-name">
                <Form.Label>{t('chat.channelName')}</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={(e) => setFieldValue('name', e.target.value)}
                  placeholder={t('chat.channelNamePlaceholder')}
                  disabled={isSubmitting || loading}
                  ref={inputRef}
                />
                <ErrorMessage
                  name="name"
                  component={Form.Text}
                  className="text-danger"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={onHide}
                disabled={isSubmitting || loading}
              >
                {t('chat.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading
                  ? t('chat.renaming')
                  : t('chat.renameButton')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RenameChannelModal;
