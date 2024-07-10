const { createWebdriverChrom } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const ChangeAreaStatusInProjectProgress = require('../src/classes/view/area/changeAreaStatusInProjectProgress');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');
const { By, until } = require('selenium-webdriver');
const { saveMetrics } = require('../src/utils/saveMetrics');

describe('INP Measurement After Area Click', async () => {

  let driverChrome = null;
  let openAreaFormINP = {
    'INP metrics': {},
  };

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('INP check for open area pop-up', async () => {
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatus = new ChangeAreaStatusInProjectProgress(driverChrome);
   
    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailSU);
    await logginPageTest.fillPasswordInput(config.passwordSU);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
     
      await changeAreaStatus.goToView(config.projectNameMain, 'su');

      await changeAreaStatus.goToSelektTab(config.projectProgress);
      await driverChrome.wait(until.elementsLocated(By.css(`.area-progress-list-areas__item[status-name="To Do"]`)), 20000);
      const areaElement = await driverChrome.findElement(By.css(`.area-progress-list-areas__item[status-name="To Do"]`));
    
      const startTime = await driverChrome.executeScript('return performance.now();');
      await areaElement.click();
      await driverChrome.executeScript(() => {
        const observer = new PerformanceObserver((list) => {
          const paintEntries = list.getEntries().filter(entry => entry.entryType === 'paint');
          if (paintEntries.length > 0) {
            const nextPaintTime = paintEntries[0].startTime;
            window.nextPaintTime = nextPaintTime;
          }
        });
        observer.observe({ entryTypes: ['paint'] });
      });

      const endTime = await driverChrome.executeScript('return window.nextPaintTime || performance.now();');
      const inp = endTime - startTime;
      console.log('Interaction to Next Paint (INP):', inp.toFixed(2), 'ms');
      openAreaFormINP['INP metrics']={
        'INP Measurement After Area Click': +inp.toFixed(2)
      };
      saveMetrics(
        config.metricsFilePath,
        config.metricfileName,
        openAreaFormINP
      );

      await driverChrome.sleep(1000);
     
 
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_change_status');
      throw error;
    }
  });

});
