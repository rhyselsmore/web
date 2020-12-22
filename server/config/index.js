const { promisify } = require('util');
const { readFile, readFileSync } = require('fs');
const yaml = require('js-yaml');

let config = undefined;
const configPath = process.env.TEMPORAL_CONFIG_PATH || './server/config.yml';

const readConfigSync = () => {
  if (!config) {
    const cfgContents = readFileSync(configPath, {
      encoding: 'utf8',
    });
    config = yaml.safeLoad(cfgContents);
  }
  return config;
};

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
    enabled: true,
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
  const routing = { defaultToNamespace: default_to_namespace };
  return routing;
};

const getTlsConfig = () => {
  let { ca, key, cert, server_name, verify_host } = readConfigSync();

  const tls = {
    ca,
    key,
    cert,
    serverName: server_name,
    verifyHost: verify_host,
  };
  return tls;
};

module.exports = {
  getAuthConfig,
  getRoutingConfig,
  getTlsConfig,
};
