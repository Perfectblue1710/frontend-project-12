import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createChannel } from '../../slices/channelsSlice';
import { containsProfanity, filterProfanity } from '../../utils/profanityFilter';
import { toast } from 'react-toastify';

const AddChannelModal = ({ show, onHide }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels, loading } = useSelector((state) => state.channels);
  const inputRef = useRef(null);
  const [profanityWarning, setProfanityWarning] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [show]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('errors.usernameLength'))
      .max(20, t('errors.usernameLength'))
      .notOneOf(channels.map(ch => ch.name), t('errors.channelExists'))
      .required(t('errors.required'))
      .test('profanity', 'Название содержит нецензурные слова', (value) => {
        if (!value) return true;
        return !containsProfanity(value);
      }),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting, setFieldError }) => {
    let channelName = values.name;
    if (containsProfanity(channelName)) {
      const filtered = filterProfanity(channelName, '*');
      setProfanityWarning(true);
      const ok = window.confirm(`Название содержит нецензурные слова.\nОтфильтрованный вариант: "${filtered}"\nСоздать канал?`);
      if (!ok) {
        setSubmitting(false);
        return;
      }
      channelName = filtered;
      toast.info('Название канала отфильтровано');
    }
    try {
      await dispatch(createChannel(channelName)).unwrap();
      resetForm();
      onHide();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) setFieldError('name', err.response.data.message);
    } finally {
      setSubmitting(false);
      setProfanityWarning(false);
    }
  };

  const handleNameChange = (e, setFieldValue) => {
    const val = e.target.value;
    setFieldValue('name', val);
    setProfanityWarning(containsProfanity(val));
  };

  return (

    <Modal show={show} onHide={onHide} onExited={() => setProfanityWarning(false)} centered animation={false}>

      <Modal.Header closeButton>
        <Modal.Title>{t('chat.addChannel')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              {profanityWarning && (
                <Alert variant="warning" className="mb-3">
                  ⚠️ Название содержит нецензурные слова. Оно будет отфильтровано.
                </Alert>
              )}
              <Form.Group controlId="modal-add-channel-name">
                <Form.Label>{t('chat.channelName')}</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={(e) => handleNameChange(e, setFieldValue)}
                  placeholder={t('chat.channelNamePlaceholder')}
                  disabled={isSubmitting || loading}
                  ref={inputRef}
                  isInvalid={containsProfanity(values.name)}
                />
                <ErrorMessage name="name" component={Form.Text} className="text-danger" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide} disabled={isSubmitting || loading}>
                {t('chat.cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting || loading || containsProfanity(values.name)}>
                {isSubmitting || loading ? t('chat.adding') : t('chat.add')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddChannelModal;
