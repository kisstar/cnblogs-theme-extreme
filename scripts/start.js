/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-console */

// Current env
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently  ignoring them
process.on('unhandledRejection', (error) => {
  throw error;
});

const webpack = require('webpack');
const chalk = require('chalk');
const inquirer = require('inquirer');
const WebpackDevServer = require('webpack-dev-server');
const detect = require('detect-port');
const configFactory = require('../config/webpack-base');
const developmentConfigFactory = require('../config/webpack-development');

const HOST = process.env.HOST || '0.0.0.0';
const DEFAULT_PORT = Number.parseInt(process.env.PORT, 10) || 3000;
let port;

(async function main() {
  const newPort = await detect(DEFAULT_PORT);

  if (newPort !== DEFAULT_PORT) {
    const question = {
      type: 'confirm',
      name: 'shouldChangePort',
      message: `Would you like to run the app on port ${newPort} instead?`,
      default: true,
    };

    console.log(chalk.yellow(`Port: ${DEFAULT_PORT} was occupied...\n`));
    const { shouldChangePort } = await inquirer.prompt(question);

    if (shouldChangePort) {
      port = newPort;
    }
  } else {
    port = DEFAULT_PORT;
  }

  if (!port) {
    return;
  }

  const webpackConfig = configFactory('development');
  const serverConfig = developmentConfigFactory();
  const compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(compiler, serverConfig);

  server.listen(port, HOST, (error) => {
    if (error) {
      console.log(chalk.red(error));
    } else {
      console.log(`Starting server on ${HOST}:${port}`);
    }
  });
})();
