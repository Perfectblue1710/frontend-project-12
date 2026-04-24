import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createChannel } from '../../slices/channelsSlice';

const AddChannelModal = ({ show, onHide }) => {
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
        channels.map(ch => ch.name),
        'Канал с таким именем уже существует'
      )
      .required('Обязательное поле'),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      await dispatch(createChannel(values.name)).unwrap();
      resetForm();
      onHide();
    } catch (error) {
      console.error('Failed to create channel:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Имя канала</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values => values.name}
                  onChange={(e) => setFieldValue('name', e.target.value)}
                  placeholder="Введите имя канала"
                  disabled={isSubmitting || loading}
                  ref={inputRef}
                />
                <ErrorMessage name="name" component={Form.Text} className="text-danger" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide} disabled={isSubmitting || loading}>
                Отмена
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting || loading}>
                {isSubmitting || loading ? 'Добавление...' : 'Добавить'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddChannelModal;
