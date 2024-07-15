const { Builder } = require('selenium-webdriver');
const ltCapabilite = require('../../capabilities');
const chrome = require('selenium-webdriver/chrome');
const safari = require('selenium-webdriver/safari');

const browsers = [
    { browser: "Safari", bVersion: "17", os: "macOS Sonoma" },
    { browser: "Chrome", bVersion: "126", os: "Windows 10" }
];

const USERNAME = ltCapabilite.capability['LT:Options'].username;
const KEY = ltCapabilite.capability['LT:Options'].accessKey;
const GRID_HOST = 'hub.lambdatest.com/wd/hub';
const gridUrl = 'https://' + USERNAME + ':' + KEY + '@' + GRID_HOST;

async function createDriver(browser, bVersion, os, testName){
    ltCapabilite.capability.browserName = browser;
    ltCapabilite.capability.browserVersion = bVersion;
    ltCapabilite.capability['LT:Options'].platformName = os;
    ltCapabilite.capability['LT:Options'].name = testName;
   
    const driver = await new Builder()
        .usingServer(gridUrl)
        .withCapabilities(ltCapabilite.capability)
        .build();
    return driver;
}

module.exports = { browsers, createDriver };

