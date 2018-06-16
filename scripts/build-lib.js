/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

function getCommand() {
  const babel = path.join(__dirname, '..', 'node_modules', '.bin', 'babel');
  const args = ['./src --out-dir ./lib', '--extends "../../.babelrc"'];

  return `${babel} ${args.join(' ')}`;
}

function handleExit(code, errorCallback) {
  if (code !== 0) {
    if (errorCallback && typeof errorCallback === 'function') {
      errorCallback();
    }

    shell.exit(code);
  }
}

function buildLib(options = {}) {
  const {
    silent = true,
    errorCallback,
  } = options;

  if (!fs.existsSync('src')) {
    if (!silent) {
      console.log('No src dir');
    }

    return;
  }

  const command = getCommand();
  const { code } = shell.exec(command, { silent });

  handleExit(code, errorCallback);
}

module.exports = { buildLib };
