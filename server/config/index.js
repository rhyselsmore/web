const { promisify } = require('util');
const { readFile } = require('fs');
const yaml = require('js-yaml');

let config = undefined;
const configPath = process.env.TEMPORAL_CONFIG_PATH || './server/config.yml';

const readConfig = async () => {
  if (!config) {
    const cfgContents = await promisify(readFile)(configPath, {
      encoding: 'utf8',
    });
    config = yaml.safeLoad(cfgContents);
  }
  return config;
};

const getAuthConfig = async () => {
  let {
    type,
    issuer,
    client_id,
    client_secret,
    audience,
    callback_base_uri,
    scope,
  } = await readConfig();

  const auth = {
    isEnabled: true,
    providers: [
      {
        type,
        issuer,
        client_id,
        client_secret,
        audience,
        callback_base_uri,
        scope,
      },
    ],
  };
  return auth;
};

const getRoutingConfig = async () => {
  let { default_to_namespace } = await readConfig();
  const routing = { default_to_namespace };
  return routing;
};

module.exports = {
  getAuthConfig,
  getRoutingConfig,
};
