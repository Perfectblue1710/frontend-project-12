import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Container, Row, Col, Form as BootstrapForm } from 'react-bootstrap';
import { setToken } from '../store/authSlice';
import { authAPI } from '../services/api';

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState(null);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, t('errors.usernameMin'))
      .max(20, t('errors.usernameMax'))
      .required(t('errors.required')),
    password: Yup.string()
      .min(6, t('errors.passwordMin'))
      .required(t('errors.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('errors.passwordsNotMatch'))
      .required(t('errors.required')),
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
        setServerError(t('errors.userExists'));
        setFieldError('username', t('errors.userExists'));
      } else {
        setServerError(t('errors.serverError'));
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
            <h2 className="text-center mb-4">{t('auth.signupTitle')}</h2>
            
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
                    <BootstrapForm.Label>{t('auth.username')}</BootstrapForm.Label>
                    <Field
                      as={BootstrapForm.Control}
                      type="text"
                      name="username"
                      placeholder={t('auth.usernamePlaceholder')}
                      isInvalid={touched.username && errors.username}
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="password" component={BootstrapForm.Text} className="text-danger" />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className="mb-3">
                    <BootstrapForm.Label>{t('auth.confirmPassword')}</BootstrapForm.Label>
                    <Field
                      as={BootstrapForm.Control}
                      type="password"
                      name="confirmPassword"
                      placeholder={t('auth.confirmPasswordPlaceholder')}
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
                    {isSubmitting ? t('auth.signingUp') : t('auth.signupButton')}
                  </Button>
                  
                  <div className="text-center">
                    <Link to="/login">{t('auth.hasAccount')}</Link>
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
