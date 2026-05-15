import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ListGroup,
  Button,
  Dropdown,
  Modal,
  Form,
  ButtonGroup,
} from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import {
  setCurrentChannel,
  createChannel,
  renameChannel,
  deleteChannel,
} from '../../slices/channelsSlice';

const ChannelList = () => {
  const dispatch = useDispatch();

  const { channels, currentChannelId, loading } = useSelector(
    (state) => state.channels,
  );

  const { isAuthenticated } = useSelector((state) => state.auth);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const addInputRef = useRef(null);
  const renameInputRef = useRef(null);

  if (!isAuthenticated) {
    return null;
  }

  const channelNames = channels.map((channel) => channel.name);

  const addSchema = Yup.object({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .notOneOf(channelNames, 'Должно быть уникальным'),
  });

  const renameSchema = Yup.object({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .notOneOf(
        channelNames.filter((name) => name !== selectedChannel?.name),
        'Должно быть уникальным',
      ),
  });

  const handleAddChannel = async (values, actions) => {
    try {
      await dispatch(createChannel(values.name)).unwrap();

      toast.success('Канал создан');

      actions.resetForm();
      setShowAddModal(false);
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleRenameChannel = async (values, actions) => {
    try {
      await dispatch(
        renameChannel({
          id: selectedChannel.id,
          name: values.name,
        }),
      ).unwrap();

      toast.success('Канал переименован');

      setShowRenameModal(false);
      setSelectedChannel(null);
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleDeleteChannel = async () => {
    try {
      await dispatch(deleteChannel(selectedChannel.id)).unwrap();

      toast.success('Канал удалён');

      setShowDeleteModal(false);
      setSelectedChannel(null);
    } catch (error) {
      toast.error('Ошибка соединения');
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>Каналы</span>

        <Button
          variant="group-vertical"
          className="p-0 text-primary btn"
          onClick={() => setShowAddModal(true)}
        >
          +
        </Button>
      </div>

      <ListGroup className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.map((channel) => (
          <ListGroup.Item
            key={channel.id}
            className="p-0 border-0"
          >
            {channel.removable ? (
              <Dropdown as={ButtonGroup} className="d-flex">
                <Button
                  type="button"
                  variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                  className="w-100 rounded-0 text-start text-truncate"
                  onClick={() => dispatch(setCurrentChannel(channel.id))}
                >
                  <span className="me-1">#</span>
                  {channel.name}
                </Button>

                <Dropdown.Toggle
                  split
                  variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                  className="flex-grow-0 rounded-0"
                  aria-label="Управление каналом"
                />

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      setSelectedChannel(channel);
                      setShowRenameModal(true);
                    }}
                  >
                    Переименовать
                  </Dropdown.Item>

                  <Dropdown.Item
                    onClick={() => {
                      setSelectedChannel(channel);
                      setShowDeleteModal(true);
                    }}
                  >
                    Удалить
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button
                type="button"
                variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                className="w-100 rounded-0 text-start"
                onClick={() => dispatch(setCurrentChannel(channel.id))}
              >
                <span className="me-1">#</span>
                {channel.name}
              </Button>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* ADD MODAL */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Добавить канал</Modal.Title>
        </Modal.Header>

        <Formik
          initialValues={{ name: '' }}
          validationSchema={addSchema}
          onSubmit={handleAddChannel}
        >
          {({ handleSubmit, errors, touched, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Field name="name">
                  {({ field }) => (
                    <Form.Control
                      {...field}
                      ref={addInputRef}
                      autoFocus
                      className={errors.name && touched.name ? 'is-invalid' : ''}
                    />
                  )}
                </Field>

                <Form.Label className="visually-hidden">
                  Имя канала
                </Form.Label>

                <ErrorMessage
                  name="name"
                  component="div"
                  className="invalid-feedback"
                />
              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Отмена
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || loading}
                >
                  Отправить
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* RENAME MODAL */}
      <Modal
        show={showRenameModal}
        onHide={() => setShowRenameModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Переименовать канал</Modal.Title>
        </Modal.Header>

        {selectedChannel && (
          <Formik
            initialValues={{ name: selectedChannel.name }}
            validationSchema={renameSchema}
            onSubmit={handleRenameChannel}
          >
            {({ handleSubmit, errors, touched, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Field name="name">
                    {({ field }) => (
                      <Form.Control
                        {...field}
                        ref={renameInputRef}
                        autoFocus
                        className={errors.name && touched.name ? 'is-invalid' : ''}
                      />
                    )}
                  </Field>

                  <Form.Label className="visually-hidden">
                    Имя канала
                  </Form.Label>

                  <ErrorMessage
                    name="name"
                    component="div"
                    className="invalid-feedback"
                  />
                </Modal.Body>

                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowRenameModal(false)}
                  >
                    Отмена
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || loading}
                  >
                    Отправить
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        )}
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Удалить канал</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Уверены?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Отмена
          </Button>

          <Button
            variant="danger"
            onClick={handleDeleteChannel}
            disabled={loading}
          >
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChannelList;
