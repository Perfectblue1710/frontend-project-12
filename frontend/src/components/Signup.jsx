import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Alert, Button, Container, Row, Col, Form as BootstrapForm } from 'react-bootstrap';
import { setToken } from '../store/authSlice';
import { fetchChannels } from '../slices/channelsSlice';
import { authAPI } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState(null);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле'),
    password: Yup.string()
      .min(6, 'Не менее 6 символов')
      .required('Обязательное поле'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
      .required('Обязательное поле'),
  });
const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
  try {
    const response = await authAPI.signup(values.username, values.password);
    const { token } = response.data;
    dispatch(setToken(token));
    await dispatch(fetchChannels()).unwrap();
    navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.response && error.response.status === 409) {
        const errorMsg = 'Такой пользователь уже существует';
        setServerError(errorMsg);
        setFieldError('username', errorMsg);
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
              validateOnChange={true}
              validateOnBlur={true}
            >
              {({ isSubmitting, errors, touched, handleChange, handleBlur }) => (
                <Form>
                  {}
                  <BootstrapForm.Group className="mb-3" controlId="signup-username">
                    <BootstrapForm.Label>Имя пользователя</BootstrapForm.Label>
                    <Field
                      as={BootstrapForm.Control}
                      type="text"
                      name="username"
                      placeholder="Введите имя пользователя"
                      isInvalid={errors.username && touched.username}
                      disabled={isSubmitting}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.username && touched.username && (
                      <div className="text-danger" style={{ fontSize: '0.875em', marginTop: '0.25rem' }}>
                        {errors.username}
                      </div>
                    )}
                  </BootstrapForm.Group>

                  {}
                  <BootstrapForm.Group className="mb-3" controlId="signup-password">
                    <BootstrapForm.Label>Пароль</BootstrapForm.Label>
                    <Field
                      as={BootstrapForm.Control}
                      type="password"
                      name="password"
                      placeholder="Введите пароль"
                      isInvalid={errors.password && touched.password}
                      disabled={isSubmitting}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.password && touched.password && (
                      <div className="text-danger" style={{ fontSize: '0.875em', marginTop: '0.25rem' }}>
                        {errors.password}
                      </div>
                    )}
                  </BootstrapForm.Group>

                  {}
                  <BootstrapForm.Group className="mb-3" controlId="signup-confirm-password">
                    <BootstrapForm.Label>Подтвердите пароль</BootstrapForm.Label>
                    <Field
                      as={BootstrapForm.Control}
                      type="password"
                      name="confirmPassword"
                      placeholder="Подтвердите пароль"
                      isInvalid={errors.confirmPassword && touched.confirmPassword}
                      disabled={isSubmitting}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <div className="text-danger" style={{ fontSize: '0.875em', marginTop: '0.25rem' }}>
                        {errors.confirmPassword}
                      </div>
                    )}
                  </BootstrapForm.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-100 mb-3"
                  >
                    {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                  </Button>
                  
                  {}
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
