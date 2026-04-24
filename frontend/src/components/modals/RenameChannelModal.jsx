import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { renameChannel } from '../../slices/channelsSlice';

const RenameChannelModal = ({ show, onHide, channelId, currentName }) => {
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
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .notOneOf(
        channels.filter(ch => ch.id !== channelId).map(ch => ch.name),
        'Канал с таким именем уже существует'
      )
      .required('Обязательное поле'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(renameChannel({ id: channelId, name: values.name })).unwrap();
      onHide();
    } catch (error) {
      console.error('Failed to rename channel:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: currentName }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Имя канала</Form.Label>
                <Field
                  innerRef={inputRef}
                  as={Form.Control}
                  type="text"
                  name="name"
                  placeholder="Введите новое имя канала"
                  disabled={isSubmitting || loading}
                />
                <ErrorMessage name="name" component={Form.Text} className="text-danger" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide} disabled={isSubmitting || loading}>
                Отмена
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting || loading}>
                {isSubmitting || loading ? 'Переименование...' : 'Переименовать'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RenameChannelModal;
