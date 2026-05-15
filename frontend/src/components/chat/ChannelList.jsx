import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ListGroup,
  Button,
  Dropdown,
  Modal,
  Form,
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

  const {
    channels,
    currentChannelId,
    loading,
  } = useSelector((state) => state.channels);

  const { isAuthenticated } = useSelector((state) => state.auth);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  if (!isAuthenticated) {
    return null;
  }

  const channelSchema = Yup.object({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .notOneOf(
        channels.map((ch) => ch.name),
        'Канал с таким именем уже существует',
      )
      .required('Обязательное поле'),
  });

  const handleAddChannel = async (
    values,
    { resetForm, setSubmitting },
  ) => {
    try {
      await dispatch(createChannel(values.name)).unwrap();
      toast.success('Канал создан');

      resetForm();
      setShowAddModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRenameChannel = async (
    values,
    { setSubmitting },
  ) => {
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteChannel = async () => {
    try {
      await dispatch(deleteChannel(selectedChannel.id)).unwrap();

      toast.success('Канал удалён');
      setShowDeleteModal(false);
      setSelectedChannel(null);
    } catch (error) {
      console.error('Failed to delete channel:', error);
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="mb-0">Каналы</h5>

        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
        >
          +
        </Button>
      </div>

      <ListGroup
        variant="flush"
        className="flex-grow-1 overflow-auto"
      >
        {channels.map((channel) => (
          <ListGroup.Item
            key={channel.id}
            className="d-flex justify-content-between align-items-center p-1 border-0"
          >
            <Button
              variant={
                channel.id === currentChannelId
                  ? 'primary'
                  : 'light'
              }
              className="w-100 text-start border-0 shadow-none"
              onClick={() =>
                dispatch(setCurrentChannel(channel.id))
              }
            >
              {channel.name}
            </Button>

            {channel.removable && (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  size="sm"
                  className="text-muted p-0 ms-2 shadow-none"
                  aria-label="Управление каналом"
                >
                  ⋮
                </Dropdown.Toggle>

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
                    className="text-danger"
                    onClick={() => {
                      setSelectedChannel(channel);
                      setShowDeleteModal(true);
                    }}
                  >
                    Удалить
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Добавление канала */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Добавить канал</Modal.Title>
        </Modal.Header>

        <Formik
          initialValues={{ name: '' }}
          validationSchema={channelSchema}
          onSubmit={handleAddChannel}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group controlId="add-channel-name">
                  <Form.Label>Имя канала</Form.Label>

                  <Field
                    as={Form.Control}
                    type="text"
                    name="name"
                    placeholder="Введите имя канала"
                    disabled={isSubmitting || loading}
                    autoFocus
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
                  onClick={() => setShowAddModal(false)}
                >
                  Отмена
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting || loading}
                >
                  Добавить
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Переименование */}
      <Modal
        show={showRenameModal}
        onHide={() => setShowRenameModal(false)}
        centered
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Переименовать канал</Modal.Title>
        </Modal.Header>

        {selectedChannel && (
          <Formik
            initialValues={{ name: selectedChannel.name }}
            validationSchema={channelSchema}
            onSubmit={handleRenameChannel}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Form.Group controlId="rename-channel-name">
                    <Form.Label>Имя канала</Form.Label>

                    <Field
                      as={Form.Control}
                      type="text"
                      name="name"
                      placeholder="Введите новое имя"
                      disabled={isSubmitting || loading}
                      autoFocus
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
                    onClick={() => setShowRenameModal(false)}
                  >
                    Отмена
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting || loading}
                  >
                    Переименовать
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        )}
      </Modal>

      {/* Удаление */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Удалить канал</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Вы уверены, что хотите удалить канал{' '}
            <strong>{selectedChannel?.name}</strong>?
          </p>

          <p className="text-danger">
            Все сообщения в этом канале будут удалены.
          </p>
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
    </div>
  );
};

export default ChannelList;