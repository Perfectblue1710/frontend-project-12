import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../../slices/channelsSlice';
import { ListGroup, Button, Dropdown, Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createChannel, renameChannel, deleteChannel } from '../../slices/channelsSlice';
import { toast } from 'react-toastify';

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
      await dispatch(renameChannel({ id: selectedChannel.id, name: values.name })).unwrap();
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
  {displayChannels.map((channel) => {
    const isRemovable = channel.removable ?? channel.id !== 1;

    if (!isRemovable) {
      return (
        <ListGroup.Item
          key={channel.id}
          action
          active={channel.id === currentChannelId}
          onClick={() => dispatch(setCurrentChannel(channel.id))}
          className="w-100 rounded-0 text-start"
        >
          <span className="me-1">#</span>
          {channel.name}
        </ListGroup.Item>
      );
    }

    return (
      <div key={channel.id} className="d-flex dropdown btn-group">
        <button
          type="button"
          className={`w-100 rounded-0 text-start text-truncate btn ${
            channel.id === currentChannelId
              ? 'btn-secondary'
              : 'btn-light'
          }`}
          onClick={() => dispatch(setCurrentChannel(channel.id))}
        >
          <span className="me-1">#</span>
          {channel.name}
        </button>

        <Dropdown onClick={(e) => e.stopPropagation()}>
          <Dropdown.Toggle
            split
            variant={channel.id === currentChannelId ? 'secondary' : 'light'}
            id={`dropdown-${channel.id}`}
          >
            <span className="visually-hidden">
              Управление каналом
            </span>
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
              onClick={() => {
                setSelectedChannel(channel);
                setShowDeleteModal(true);
              }}
            >
              Удалить
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  })}
</ListGroup>
    </div>
  );
};

export default ChannelList;