import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setError, setLoading, clearError } from '../store/authSlice';
import { authAPI } from '../services/api';
import { Alert, Button, Form as BootstrapForm, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);

  const initialValues = {
    username: '',
    password: '',
  };

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = 'Введите имя пользователя';
    }
    if (!values.password) {
      errors.password = 'Введите пароль';
    }
    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(clearError());
    dispatch(setLoading(true));
    
    try {
      const response = await authAPI.login(values.username, values.password);
      const { token } = response.data;
      dispatch(setToken(token));
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.status === 401) {
        dispatch(setError('Неверное имя пользователя или пароль'));
      } else {
        dispatch(setError('Ошибка сервера. Попробуйте позже.'));
      }
    } finally {
      dispatch(setLoading(false));
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <div className="bg-light p-4 rounded shadow">
            <h2 className="text-center mb-4">Вход в чат</h2>
            
            {error && (
              <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>
                {error}
              </Alert>
            )}
            
            <Formik
              initialValues={initialValues}
              validate={validate}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <BootstrapForm.Group className="mb-3">
                    <BootstrapForm.Label>Имя пользователя</BootstrapForm.Label>
                    <Field
                      as={BootstrapForm.Control}
                      type="text"
                      name="username"
                      placeholder="Введите username"
                      disabled={loading}
                    />
                    <ErrorMessage name="username" component="div" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-3">
                    <BootstrapForm.Label>Пароль</BootstrapForm.Label>
                    <Field
                      as={BootstrapForm.Control}
                      type="password"
                      name="password"
                      placeholder="Введите пароль"
                      disabled={loading}
                    />
                    <ErrorMessage name="password" component="div" className="text-danger mt-1" />
                  </BootstrapForm.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-100"
                  >
                    {loading ? 'Вход...' : 'Войти'}
                  </Button>
                  
                  <div className="text-center mt-3 text-muted">
                    <small>Тестовые данные: admin / admin</small>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
