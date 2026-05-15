import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../slices/channelsSlice';
import { ListGroup, Button, Dropdown, Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
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
  const { channels, currentChannelId, loading } = useSelector((state) => state.channels);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  if (!isAuthenticated) return null;

  let displayChannels = channels;

  if (!displayChannels || displayChannels.length === 0) {
    displayChannels = [{ id: 1, name: 'general' }];
  } else if (!displayChannels.some((ch) => ch.name === 'general')) {
    displayChannels = [{ id: 1, name: 'general' }, ...displayChannels];
  }

  const addChannelSchema = Yup.object({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .notOneOf(channels.map(ch => ch.name), 'Канал с таким именем уже существует')
      .required('Обязательное поле'),
  });

  const renameChannelSchema = Yup.object({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .notOneOf(
        channels.filter(ch => ch.id !== selectedChannel?.id).map(ch => ch.name),
        'Канал с таким именем уже существует'
      )
      .required('Обязательное поле'),
  });

  const handleAddChannel = async (values, { resetForm, setSubmitting }) => {
    try {
      await dispatch(createChannel(values.name)).unwrap();
      toast.success('Канал создан');
      resetForm();
      setShowAddModal(false);
    } catch (error) {
      toast.error('Ошибка при создании канала');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRenameChannel = async (values, { setSubmitting }) => {
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
      toast.error('Ошибка при переименовании');
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
      toast.error('Ошибка при удалении');
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="mb-0">Каналы</h5>
        <Button variant="outline-primary" size="sm" onClick={() => setShowAddModal(true)}>
          +
        </Button>
      </div>

      <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
        {displayChannels.map((channel) => (
          <div key={channel.id} className="d-flex align-items-stretch w-100">
            <button
              type="button"
              className={`btn w-100 text-start rounded-0 ${
                channel.id === currentChannelId ? 'btn-primary' : 'btn-light'
              }`}
              onClick={() => dispatch(setCurrentChannel(channel.id))}
              style={{ padding: '0.75rem 1rem' }}
            >
              # {channel.name}
            </button>
            {channel.removable && (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  size="sm"

                  className="text-muted p-0 ms-2 shadow-none"
                  aria-label="Управление каналом"
                >
                  ⋮
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => {
                    setSelectedChannel(channel);
                    setShowRenameModal(true);
                  }}>
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
          </div>
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
          validationSchema={addChannelSchema}
          onSubmit={handleAddChannel}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group controlId="add-channel-name">
                  <Form.Label>Имя канала</Form.Label>
                  <Field
                    as={Form.Control}
                    id="channel-name"
                    type="text"
                    name="name"
                    placeholder="Введите имя канала"
                    disabled={isSubmitting || loading}
                    autoFocus
                  />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={isSubmitting || loading}>
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
            validationSchema={renameChannelSchema}
            onSubmit={handleRenameChannel}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Modal.Body>
                           <Form.Label htmlFor="rename-channel-name">Имя канала</Form.Label>
                  <Form.Group controlId="rename-channel-name">
                    <Form.Label>Имя канала</Form.Label>

                    <Field
                      as={Form.Control}
                      id="rename-channel-name"
                      type="text"
                      name="name"
                      placeholder="Введите новое имя"
                      disabled={isSubmitting || loading}
                      autoFocus
                    />
                    <ErrorMessage name="name" component="div" className="text-danger" />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowRenameModal(false)}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={isSubmitting || loading}>
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
          <p>Вы уверены, что хотите удалить канал <strong>#{selectedChannel?.name}</strong>?</p>
          <p className="text-danger">Все сообщения в этом канале будут безвозвратно удалены.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleDeleteChannel} disabled={loading}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChannelList;
