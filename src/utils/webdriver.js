const { Builder, Key } = require('selenium-webdriver');
const chrom = require('selenium-webdriver/chrome');

async function createWebdriverChrom() {
  const options = new chrom.Options();
  options.addArguments('--incognito');
  options.addArguments('--start-maximized');
  options.addArguments('--private');
  // options.addArguments("--window-size=2550px,2135px");

  let driver = await new Builder()
    .forBrowser('chrome')
    .usingServer("http://selenium-hub:4444/wd/hub")
    .setChromeOptions(options)
    .build();

  // await driver.manage().window().fullscreen();

  return driver;
}

module.exports = { createWebdriverChrom };
