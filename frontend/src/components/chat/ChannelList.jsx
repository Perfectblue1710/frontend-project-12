import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ListGroup,
  Button,
  Modal,
  Form,
} from 'react-bootstrap';
import { Formik, Field } from 'formik';

import {
  setCurrentChannel,
  createChannel,
} from '../../slices/channelsSlice';

const ChannelList = () => {
  const dispatch = useDispatch();

  const { channels, currentChannelId } = useSelector(
    (state) => state.channels,
  );

  const { isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [showModal, setShowModal] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  let displayChannels = channels;

  if (!displayChannels || displayChannels.length === 0) {
    displayChannels = [
      { id: 1, name: 'general' },
    ];
  } else if (
    !displayChannels.some(
      (channel) => channel.name === 'general',
    )
  ) {
    displayChannels = [
      { id: 1, name: 'general' },
      ...displayChannels,
    ];
  }

  return (
    <div className="h-100 d-flex flex-column">
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Каналы</h5>

        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setShowModal(true)}
        >
          +
        </Button>
      </div>

      <ListGroup
        variant="flush"
        className="flex-grow-1 overflow-auto"
      >
        {displayChannels.map((channel) => (
          <ListGroup.Item
            key={channel.id}
            as="button"
            action
            active={channel.id === currentChannelId}
            onClick={() =>
              dispatch(setCurrentChannel(channel.id))
            }
            className="text-start"
          >
            {channel.name}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Добавить канал
          </Modal.Title>
        </Modal.Header>

        <Formik
          initialValues={{ name: '' }}
          onSubmit={async (values, { resetForm }) => {
            await dispatch(
              createChannel(values.name),
            );

            resetForm();
            setShowModal(false);
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Field
                  as={Form.Control}
                  name="name"
                  autoFocus
                />
              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Отмена
                </Button>

                <Button type="submit">
                  Отправить
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default ChannelList;
