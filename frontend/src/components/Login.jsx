import { Formik, Form, Field, ErrorMessage } from 'formik';

const Login = () => {
  const initialValues = {
    username: '',
    password: '',
  };

  const handleSubmit = (values) => {
    console.log('Форма отправлена:', values);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Вход в чат</h2>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
              Имя пользователя
            </label>
            <Field
              type="text"
              id="username"
              name="username"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <ErrorMessage name="username" component="div" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
              Пароль
            </label>
            <Field
              type="password"
              id="password"
              name="password"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <ErrorMessage name="password" component="div" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }} />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Войти
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;