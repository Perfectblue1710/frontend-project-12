import React, { useState } from 'react';
import { Button, Alert, Card, Container, Row, Col } from 'react-bootstrap';
import { testRollbar, logInfo, logError } from '../utils/rollbar';

const RollbarTest = () => {
  const [status, setStatus] = useState('');

  const handleSendInfo = () => {
    logInfo('User clicked info button', { timestamp: Date.now() });
    setStatus('✅ Info событие отправлено');
    setTimeout(() => setStatus(''), 3000);
  };

  const handleSendWarning = () => {
    logError(new Error('Test warning from button'), { level: 'warning' });
    setStatus('⚠️ Warning событие отправлено');
    setTimeout(() => setStatus(''), 3000);
  };

  const handleSendError = () => {
    try {
      throw new Error('Manual test error from React component');
    } catch (error) {
      logError(error, { source: 'test_button', action: 'test_error' });
      setStatus('❌ Error событие отправлено');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleTest = async () => {
    await testRollbar();
    setStatus('🧪 Тестовые события отправлены');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h3" className="text-center">
              Тест интеграции Rollbar
            </Card.Header>
            <Card.Body>
              <Alert variant="info">
                <strong>Важно:</strong> Убедитесь, что вы заменили токен в файле 
                <code>src/utils/rollbar.js</code> на ваш реальный токен из аккаунта Rollbar!
              </Alert>
              
              {status && (
                <Alert variant="success" className="mt-3">
                  {status}
                </Alert>
              )}
              
              <div className="d-grid gap-3 mt-3">
                <Button variant="primary" size="lg" onClick={handleTest}>
                  🧪 Отправить все тестовые события
                </Button>
                <Button variant="success" onClick={handleSendInfo}>
                  📝 Отправить Info событие
                </Button>
                <Button variant="warning" onClick={handleSendWarning}>
                  ⚠️ Отправить Warning событие
                </Button>
                <Button variant="danger" onClick={handleSendError}>
                  ❌ Отправить Error событие
                </Button>
              </div>
              
              <hr />
              
              <div className="mt-3">
                <h6>Инструкция:</h6>
                <ol>
                  <li>Нажмите любую кнопку выше</li>
                  <li>Откройте консоль браузера (F12) для проверки логов</li>
                  <li>Перейдите в дашборд Rollbar → "Items"</li>
                  <li>Подождите 1-2 минуты (события могут задерживаться)</li>
                  <li>Вы должны увидеть тестовые события в разделе "Recent Items"</li>
                </ol>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RollbarTest;
