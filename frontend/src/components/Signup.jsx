import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Alert, Button, Container, Row, Col, Form as BootstrapForm } from 'react-bootstrap';
import { setToken } from '../store/authSlice';
import { authAPI } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState(null);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Имя пользователя должно быть от 3 до 20 символов')
      .max(20, 'Имя пользователя должно быть от 3 до 20 символов')
      .required('Обязательное поле'),
    password: Yup.string()
      .min(6, 'Пароль должен быть не менее 6 символов')
      .required('Обязательное поле'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
      .required('Обязательное поле'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setServerError(null);
    
    try {
      const response = await authAPI.signup(values.username, values.password);
      const { token } = response.data;
      dispatch(setToken(token));
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.response && error.response.status === 409) {
        setServerError('Пользователь с таким именем уже существует');
        setFieldError('username', 'Пользователь с таким именем уже существует');
      } else {
        setServerError('Ошибка сервера. Попробуйте позже.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <div className="bg-light p-4 rounded shadow">
            <h2 className="text-center mb-4">Регистрация</h2>
            
            {serverError && (
              <Alert variant="danger" onClose={() => setServerError(null)} dismissible>
                {serverError}
              </Alert>
            )}
            
            <Formik
              initialValues={{
                username: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <BootstrapForm.Group className="mb-3">
                    <BootstrapForm.Label>Имя пользователя</BootstrapForm.Label>
                    <Field
                      as={BootstrapForm.Control}
                      type="text"
                      name="username"
                      placeholder="Введите имя пользователя"
                      isInvalid={touched.username && errors.username}
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="username" component={BootstrapForm.Text} className="text-danger" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-3">
                    <BootstrapForm.Label>Пароль</BootstrapForm.Label>
                    <Field
                      as={BootstrapForm.Control}
                      type="password"
                      name="password"
                      placeholder="Введите пароль"
                      isInvalid={touched.password && errors.password}
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="password" component={BootstrapForm.Text} className="text-danger" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-3">
                    <BootstrapForm.Label>Подтверждение пароля</BootstrapForm.Label>
                    <Field
                      as={BootstrapForm.Control}
                      type="password"
                      name="confirmPassword"
                      placeholder="Подтвердите пароль"
                      isInvalid={touched.confirmPassword && errors.confirmPassword}
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="confirmPassword" component={BootstrapForm.Text} className="text-danger" />
                  </BootstrapForm.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-100 mb-3"
                  >
                    {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                  </Button>
                  
                  <div className="text-center">
                    <Link to="/login">Уже есть аккаунт? Войдите</Link>
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

export default Signup;
