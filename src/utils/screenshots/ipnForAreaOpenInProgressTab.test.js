const { browsers, createDriver } = require('../webdriver');
const LoginPage = require('../../classes/auth/login');
const ChangeAreaStatusInProjectProgress = require('../../classes/view/area/changeAreaStatusInProjectProgress');
const makeScreenshot = require('../makeScreenShot');
const { describe } = require('mocha');
const config = require('../config');
const { By, until } = require('selenium-webdriver');
const { saveMetrics } = require('../saveMetrics');

describe('INP Measurement After Area Click', async () => {
  browsers.forEach(({ browser, bVersion, os }) => {
    let driver = null;
    let openAreaFormINP = {
      'INP metrics': {},
    };
    let testname = `INP Measurement After Area Click ${browser}`;
    beforeEach(async () => {
      driver = await createDriver(browser, bVersion, os, testname);
    });

    afterEach(async () => {
      if (driver) {
        await driver.quit();
      }
    });

    it('INP check for open area pop-up', async () => {
      console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

      const logginPageTest = new LoginPage(driver, config.urlLoginPage);
      const changeAreaStatus = new ChangeAreaStatusInProjectProgress(driver);

      await logginPageTest.openLoginForm();
      await logginPageTest.fillEmailInput(config.emailSU);
      await logginPageTest.fillPasswordInput(config.passwordSU);
      await logginPageTest.checkSaveForFuture();
      await logginPageTest.login(config.mainCompanyPage);

      try {
        await changeAreaStatus.goToView(config.projectNameMain, 'su');

        await changeAreaStatus.goToSelektTab(config.projectProgress);
        await driver.wait(
          until.elementsLocated(
            By.css(`.area-progress-list-areas__item[status-name="To Do"]`)
          ),
          20000
        );
        const areaElement = await driver.findElement(
          By.css(`.area-progress-list-areas__item[status-name="To Do"]`)
        );

        const startTime = await driver.executeScript(
          'return performance.now();'
        );
        await areaElement.click();
        await driver.executeScript(() => {
          const observer = new PerformanceObserver(list => {
            const paintEntries = list
              .getEntries()
              .filter(entry => entry.entryType === 'paint');
            if (paintEntries.length > 0) {
              const nextPaintTime = paintEntries[0].startTime;
              window.nextPaintTime = nextPaintTime;
            }
          });
          observer.observe({ entryTypes: ['paint'] });
        });

        const endTime = await driver.executeScript(
          'return window.nextPaintTime || performance.now();'
        );
        const inp = endTime - startTime;
        console.log('Interaction to Next Paint (INP):', inp.toFixed(2), 'ms');
        openAreaFormINP['INP metrics'] = {
          'INP Measurement After Area Click': +inp.toFixed(2),
        };
        if (browser === 'Safari') {
          saveMetrics(
            config.metricsFilePath,
            config.metricfileNameSafari,
            openAreaFormINP
          );
        } else {
          saveMetrics(
            config.metricsFilePath,
            config.metricfileNameChrom,
            openAreaFormINP
          );
        }
        await driver.executeScript('lambda-status=passed');
        await driver.sleep(1000);
      } catch (error) {
        await makeScreenshot(driver, 'task_change_status');
        await driver.executeScript('lambda-status=failed');
        throw error;
      }
    });
  });
});
