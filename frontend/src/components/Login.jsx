import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Alert, Button, Container, Row, Col, Form as BootstrapForm } from 'react-bootstrap';
import { setToken, setError, setLoading, clearError } from '../store/authSlice';
import { authAPI } from '../services/api';
import { logError, logInfo } from '../utils/rollbar';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    username: Yup.string().required(t('errors.required')),
    password: Yup.string().required(t('errors.required')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(clearError());
    dispatch(setLoading(true));
    
    try {
      const response = await authAPI.login(values.username, values.password);
      const { token } = response.data;
      dispatch(setToken(token));
      logInfo('User logged in successfully', { username: values.username });
      toast.success(`Добро пожаловать, ${values.username}!`);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      logError(err, { 
        action: 'login', 
        username: values.username,
        status: err.response?.status 
      });
      
      if (err.response && err.response.status === 401) {
        const errorMsg = t('errors.invalidCredentials');
        dispatch(setError(errorMsg));
        toast.error(errorMsg);
      } else if (err.code === 'ERR_NETWORK') {
        const errorMsg = t('toasts.networkError');
        dispatch(setError(errorMsg));
        toast.error(errorMsg);
      } else {
        const errorMsg = t('errors.serverError');
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
            <h2 className="text-center mb-4">{t('auth.loginTitle')}</h2>
            
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
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <BootstrapForm.Group className="mb-3">
                    <BootstrapForm.Label>{t('auth.usernameLogin')}</BootstrapForm.Label>
                    <Field
                      as={BootstrapForm.Control}
                      type="text"
                      name="username"
                      placeholder={t('auth.usernamePlaceholder')}
                      isInvalid={touched.username && errors.username}
                      disabled={loading}
                    />
                    <ErrorMessage name="username" component={BootstrapForm.Text} className="text-danger" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-3">
                    <BootstrapForm.Label>{t('auth.password')}</BootstrapForm.Label>
                    <Field
                      as={BootstrapForm.Control}
                      type="password"
                      name="password"
                      placeholder={t('auth.passwordPlaceholder')}
                      isInvalid={touched.password && errors.password}
                      disabled={loading}
                    />
                    <ErrorMessage name="password" component={BootstrapForm.Text} className="text-danger" />
                  </BootstrapForm.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-100 mb-3"
                  >
                    {loading ? t('auth.loggingIn') : t('auth.loginButton')}
                  </Button>
                  
                  <div className="text-center">
                    <Link to="/signup">{t('auth.noAccount')}</Link>
                  </div>
                  
                  <div className="text-center mt-2 text-muted">
                    <small>{t('auth.testCredentials')}</small>
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
