import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Alert, Button, Container, Row, Col, Form as BootstrapForm } from 'react-bootstrap';
import { setToken, setError, setLoading, clearError } from '../store/authSlice';
import { authAPI } from '../services/api';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    username: Yup.string().required('Обязательное поле'),
    password: Yup.string().required('Обязательное поле'),
  });

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
        const errorMsg = 'Неверные имя пользователя или пароль';
        dispatch(setError(errorMsg));
        toast.error(errorMsg);
      } else {
        const errorMsg = 'Ошибка сервера. Попробуйте позже.';
        dispatch(setError(errorMsg));
        toast.error(errorMsg);
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
              initialValues={{ username: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched, handleChange, handleBlur }) => (
                <Form>
                  <BootstrapForm.Group className="mb-3">
                    <BootstrapForm.Label>Ваш ник</BootstrapForm.Label>
                    <Field
                      as={BootstrapForm.Control}
                      type="text"
                      name="username"
                      placeholder="Введите имя пользователя"
                      isInvalid={errors.username && touched.username}
                      disabled={loading}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.username && touched.username && (
                      <div className="text-danger" style={{ fontSize: '0.875em', marginTop: '0.25rem' }}>
                        {errors.username}
                      </div>
                    )}
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-3">
                    <BootstrapForm.Label>Пароль</BootstrapForm.Label>
                    <Field
                      as={BootstrapForm.Control}
                      type="password"
                      name="password"
                      placeholder="Введите пароль"
                      isInvalid={errors.password && touched.password}
                      disabled={loading}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.password && touched.password && (
                      <div className="text-danger" style={{ fontSize: '0.875em', marginTop: '0.25rem' }}>
                        {errors.password}
                      </div>
                    )}
                  </BootstrapForm.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-100 mb-3"
                  >
                    {loading ? 'Вход...' : 'Войти'}
                  </Button>
                  
                  {/* ССЫЛКА НА РЕГИСТРАЦИЮ */}
                  <div className="text-center">
                    <Link to="/signup">Нет аккаунта? Зарегистрируйтесь</Link>
                  </div>
                  
                  <div className="text-center mt-2 text-muted">
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
