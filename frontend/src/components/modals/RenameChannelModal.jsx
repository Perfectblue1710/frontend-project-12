import { Modal, Button, Form } from 'react-bootstrap'
import { Formik, Field, ErrorMessage } from 'formik'

const RenameChannelModal = ({
  show,
  onHide,
  onSubmit,
  validationSchema,
  loading,
  selectedChannel,
}) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>Переименовать канал</Modal.Title>
    </Modal.Header>

    {selectedChannel && (
      <Formik
        initialValues={{ name: selectedChannel.name }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group>
                <Form.Label htmlFor="rename-channel-name">
                  Имя канала
                </Form.Label>

                <Field
                  as={Form.Control}
                  id="rename-channel-name"
                  type="text"
                  name="name"
                  placeholder="Введите новое имя"
                  disabled={isSubmitting || loading}
                  autoFocus
                />

                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-danger"
                />
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={onHide}
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
)

export default RenameChannelModal
