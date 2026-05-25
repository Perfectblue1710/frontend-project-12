import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ListGroup, Button, Dropdown } from 'react-bootstrap'
import { toast } from 'react-toastify'

import {
  setCurrentChannel,
  createChannel,
  renameChannel,
  deleteChannel,
} from '../../slices/channelsSlice'

import {
  getAddChannelSchema,
  getRenameChannelSchema,
} from '../../utils/channelsSchemas'

import AddChannelModal from '../modals/AddChannelModal'
import RenameChannelModal from '../modals/RenameChannelModal'
import DeleteChannelModal from '../modals/DeleteChannelModal'

const ChannelList = () => {
  const dispatch = useDispatch()

  const {
    channels,
    currentChannelId,
    loading,
  } = useSelector(state => state.channels)

  const { isAuthenticated } = useSelector(state => state.auth)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(null)

  if (!isAuthenticated) return null

  let displayChannels = channels

  if (!displayChannels || displayChannels.length === 0) {
    displayChannels = [{ id: 1, name: 'general' }]
  }
  else if (!displayChannels.some(ch => ch.name === 'general')) {
    displayChannels = [{ id: 1, name: 'general' }, ...displayChannels]
  }

  const addChannelSchema = getAddChannelSchema(channels)

  const renameChannelSchema = getRenameChannelSchema(
    channels,
    selectedChannel,
  )

  const handleAddChannel = async (
    values,
    { resetForm, setSubmitting },
  ) => {
    try {
      await dispatch(createChannel(values.name)).unwrap()

      toast.success('Канал создан')

      resetForm()
      setShowAddModal(false)
    }
    catch {
      toast.error('Ошибка при создании канала')
    }
    finally {
      setSubmitting(false)
    }
  }

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
      ).unwrap()

      toast.success('Канал переименован')

      setShowRenameModal(false)
      setSelectedChannel(null)
    }
    catch {
      toast.error('Ошибка при переименовании')
    }
    finally {
      setSubmitting(false)
    }
  }

  const handleDeleteChannel = async () => {
    try {
      await dispatch(
        deleteChannel(selectedChannel.id),
      ).unwrap()

      toast.success('Канал удалён')

      setShowDeleteModal(false)
      setSelectedChannel(null)
    }
    catch {
      toast.error('Ошибка при удалении')
    }
  }

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
        {displayChannels.map(channel => (
          <div
            key={channel.id}
            className="d-flex align-items-stretch w-100"
          >
            <button
              type="button"
              className={`btn w-100 text-start rounded-0 ${
                channel.id === currentChannelId
                  ? 'btn-primary'
                  : 'btn-light'
              }`}
              onClick={() => dispatch(setCurrentChannel(channel.id))}
              style={{ padding: '0.75rem 1rem' }}
            >
              #
              {' '}
              {channel.name}
            </button>

            {channel.id !== 1 && (
              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  size="sm"
                  className="rounded-0"
                  style={{ padding: '0.75rem 0.5rem' }}
                >
                  <span className="visually-hidden">
                    Управление каналом
                  </span>

                  ⋮
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      setSelectedChannel(channel)
                      setShowRenameModal(true)
                    }}
                  >
                    Переименовать
                  </Dropdown.Item>

                  <Dropdown.Item
                    className="text-danger"
                    onClick={() => {
                      setSelectedChannel(channel)
                      setShowDeleteModal(true)
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

      <AddChannelModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={handleAddChannel}
        validationSchema={addChannelSchema}
        loading={loading}
      />

      <RenameChannelModal
        show={showRenameModal}
        onHide={() => setShowRenameModal(false)}
        onSubmit={handleRenameChannel}
        validationSchema={renameChannelSchema}
        loading={loading}
        selectedChannel={selectedChannel}
      />

      <DeleteChannelModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={handleDeleteChannel}
        loading={loading}
        selectedChannel={selectedChannel}
      />
    </div>
  )
}

export default ChannelList
