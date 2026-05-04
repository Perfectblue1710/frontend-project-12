import Rollbar from 'rollbar';

const rollbarConfig = {
  accessToken: '8278feb146b34497bcab09fc401c0978b2d2fd3be29d3008f1101b13b13fcdac287b057d3d993b4949ddd849168dd106', 
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: import.meta.env.MODE === 'production' ? 'production' : 'development',
  enabled: true, // Включен всегда
  autoInstrument: {
    network: true,
    log: true,
    dom: true,
    navigation: true,
    connectivity: true,
  },
  payload: {
    client: {
      javascript: {
        source_map_enabled: false,
        code_version: '1.0.0',
      },
    },
  },
};

const rollbar = new Rollbar(rollbarConfig);

console.log(`Rollbar initialized in ${rollbarConfig.environment} mode`);

export const logError = (error, context = {}) => {
  console.error('Error:', error);
  rollbar.error(error, context);
};

export const logInfo = (message, context = {}) => {
  console.log('Info:', message);
  rollbar.info(message, context);
};

export const logWarning = (message, context = {}) => {
  console.warn('Warning:', message);
  rollbar.warning(message, context);
};

export default rollbar;
