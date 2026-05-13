import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
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

  let displayChannels = channels || [];

  if (
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
    <div>
      <div className="d-flex justify-content-between p-2">
        <span>Каналы</span>

        <button
          type="button"
          onClick={() => setShowModal(true)}
        >
          +
        </button>
      </div>

      <div className="d-flex flex-column">
        {displayChannels.map((channel) => (
          <button
            key={channel.id}
            type="button"
            onClick={() =>
              dispatch(
                setCurrentChannel(channel.id),
              )
            }
            className={
              channel.id === currentChannelId
                ? 'btn btn-primary'
                : 'btn btn-light'
            }
          >
            {channel.name}
          </button>
        ))}
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Formik
          initialValues={{ name: '' }}
          onSubmit={async (values) => {
            await dispatch(
              createChannel(values.name),
            );

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
                <button type="submit">
                  Отправить
                </button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default ChannelList;