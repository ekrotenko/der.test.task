'use strict';
const moment = require('moment');

exports.config = {
  framework: 'jasmine',
  directConnect: true,
  baseUrl: 'PUT YOUR BASE URL HERE',

  capabilities: {
    logName: 'dervico.test',
    browserName: 'chrome',
    chromeOptions: {
      args: [
        '--disable-extensions', '--window-size=1920,1920',
        '--headless', '--disable-gpu'
      ]
    }
  },

  allScriptsTimeout: 300000,
  specs: './specs/**/*.spec.js',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 300000,
    // remove `dots` reporter
    print: () => {
    }
  },

  onPrepare,
  plugins: getPlugins(),

  disableChecks: true,

  params: {
    waitTimeout: 10000
  }
};

async function onPrepare () {
  global.projectDir = process.cwd();
  global.ptorHelper = require('protractor-helpers');
  global.using = require('jasmine-data-provider');

  global.htmlPages = require('./html.pages.list');

  await browser.waitForAngularEnabled(false);
  browser.resetUrl = 'file:///';
  const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
  const params = {
    spec: {
      displayStacktrace: false
    },
    summary: {
      displayStacktrace: false
    }
  };

  jasmine.getEnv().addReporter(new SpecReporter(params));
}

function getPlugins () {
  const plugins = [];
  const reportDirName = `html-report/${moment().format('DD-MM-YYYY hh:mm:ss')}`;
  const screenshotPath = `./${reportDirName}`;

  plugins.push({
    package: 'protractor-screenshoter-plugin',
    screenshotPath,
    screenshotOnExpect: 'failure+success',
    screenshotOnSpec: 'none',
    withLogs: false,
    writeReportFreq: 'asap',
    imageToAscii: 'none',
    clearFoldersBeforeTest: true
  });

  return plugins;
}
