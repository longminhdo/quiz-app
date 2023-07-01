import devConfigs from './dev';
import stagingConfigs from './staging';

interface Configs {
  BE_BASE_URL?: string;
  FE_BASE_URL?: string;
  SSO_DOMAIN?: string;
  SSO_TEST_DOMAIN?: string;
}

const getConfigs = () => {
  let configs: Configs = {};

  switch (process.env.REACT_APP_ENV) {
    case 'staging':
      configs = stagingConfigs;
      break;
    default:
      configs = devConfigs;
  }
  return configs;
};

const configs = getConfigs();
export default configs;
