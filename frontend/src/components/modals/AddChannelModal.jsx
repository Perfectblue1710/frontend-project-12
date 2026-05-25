import { Modal, Button, Form } from 'react-bootstrap'
import { Formik, Field, ErrorMessage } from 'formik'

const AddChannelModal = ({
  show,
  onHide,
  onSubmit,
  validationSchema,
  loading,
}) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>Добавить канал</Modal.Title>
    </Modal.Header>

    <Formik
      initialValues={{ name: '' }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label htmlFor="channel-name">
                Имя канала
              </Form.Label>

              <Field
                as={Form.Control}
                id="channel-name"
                type="text"
                name="name"
                placeholder="Введите имя канала"
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
              Добавить
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Formik>
  </Modal>
)

export default AddChannelModal
