const { Builder } = require('selenium-webdriver');
const ltCapabilite = require('../../capabilities');
const chrome = require('selenium-webdriver/chrome');
const safari = require('selenium-webdriver/safari');

const browsers = [
  { browser: 'Safari', bVersion: '17', os: 'macOS Sonoma' },
  { browser: 'Chrome', bVersion: '126', os: 'macOS Sonoma' },
];

const USERNAME = ltCapabilite.capability['LT:Options'].username;
const KEY = ltCapabilite.capability['LT:Options'].accessKey;
const GRID_HOST = 'hub.lambdatest.com/wd/hub';
const gridUrl = 'https://' + USERNAME + ':' + KEY + '@' + GRID_HOST;

const isRunningInDocker = process.env.RUNNING_IN_DOCKER === 'true';
const isRunningInTeamCity = process.env.RUNNING_IN_TEAMCITY === 'true';

async function createDriver(browser, bVersion, os, testName) {
  
let driver;

  if (isRunningInDocker || isRunningInTeamCity) {
    console.log('running in docker or on teamcity');
    ltCapabilite.capability.browserName = browser;
    ltCapabilite.capability.browserVersion = bVersion;
    ltCapabilite.capability['LT:Options'].platformName = os;
    ltCapabilite.capability['LT:Options'].name = testName;

    driver = await new Builder()
      .usingServer(gridUrl)
      .withCapabilities(ltCapabilite.capability)
      .build();
    return driver;
  } else {
    
    console.log('running local', process.platform);
    const options = new chrome.Options();
    options.addArguments('--incognito');
    options.addArguments('--start-maximized');
    options.addArguments('--private');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

      return driver
  }
}

module.exports = { browsers, createDriver };
