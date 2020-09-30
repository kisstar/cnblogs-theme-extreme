/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-console */

// Current env
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently  ignoring them
process.on('unhandledRejection', (error) => {
  throw error;
});

// const fs = require('fs-extra');
// const path = require('path');
const webpack = require('webpack');
const formatMessages = require('webpack-format-messages');
const chalk = require('chalk');
const configFactory = require('../config/webpack-base');

const config = configFactory('production');
const compiler = webpack(config);

function compilerHander(error, stats) {
  let messages;
  if (error) {
    messages = {
      errors: [formatMessages.formatMessage(error)],
      warnings: [],
    };
  } else {
    // const publicDirectory = path.resolve(__dirname, '../public');
    // if (fs.existsSync(publicDirectory)) {
    //   fs.copySync(publicDirectory, path.resolve(__dirname, '../dist'), {
    //     dereference: true,
    //     filter: (file) => true,
    //   });
    // }

    messages = formatMessages(stats);
  }

  const hasErrors = !!messages.errors.length;
  const hasWarning = !!messages.warnings.length;

  if (!hasErrors && !hasWarning) {
    console.log(chalk.green('Build successfully'));
  }

  if (hasErrors) {
    console.log(chalk.red(messages.errors.join('\n\n')));
    return;
  }

  if (hasWarning) {
    console.log(chalk.yellow(messages.warnings.join('\n\n')));
  }
}

console.info('Creating an optimized production build...');
compiler.run(compilerHander);
