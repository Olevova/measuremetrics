const { createWebdriverChrom } = require('../webdriver');
const LoginPage = require('../../classes/auth/login');
const ChangeAreaStatus = require('../../classes/view/area/changeAreaStatusInView');
const ChangeAreaStatusInProjectProgress = require('../../classes/view/area/changeAreaStatusInProjectProgress');
const makeScreenshot = require('../makeScreenShot');
const { describe } = require('mocha');
const should = require('chai').should();
const config = require('../config');
// const { nanoid } = require('nanoid');

describe('check metrics', async () => {
  // here add parameters for creation
  let driverChrome = null;

  // const URL = 'http://frontend-cj:4200/login';
  // const urlForCheck = "http://frontend-cj:4200/system/dashboard";
  // const companiesPage = 'http://frontend-cj:4200/system/companies';

  const companiesPage =
    'https://dev-frontend.colorjob.terenbro.com/system/companies';
  const URL = 'https://dev-frontend.colorjob.terenbro.com/login';
  const urlForCheck =
    'https://dev-frontend.colorjob.terenbro.com/system/dashboard';
  const email = 'superadmin@gmail.com';
  const password = 'colorjob';
  const project = 'testing template';
  let obtainedMetrics;
  let performance;
  let navigationTimings;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('check metrics', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatusInProgress = new ChangeAreaStatusInProjectProgress(
      driverChrome
    );

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      await changeAreaStatusInProgress.goToView(project);
      await changeAreaStatusInProgress.goToSelektTab('Project Progress');
      await driverChrome.sendAndGetDevToolsCommand('Performance.enable');
      obtainedMetrics = await driverChrome.sendAndGetDevToolsCommand(
        'Performance.getMetrics'
      );
      performance = await driverChrome.executeScript(
        'return window.performance.timing;'
      );
      navigationTimings = await driverChrome.executeScript(
        "return window.performance.getEntriesByType('navigation')"
      );
      // const timeToFirstByte = performance.responseStart - performance.requestStart;
      // console.log(`Time to First Byte (TTFB): ${timeToFirstByte} ms`);
      // const domContentLoadedTime = performance.domContentLoadedEventEnd - performance.navigationStart;
      // console.log(`DOM Content Loaded Time: ${domContentLoadedTime} ms`);
      // const pageLoadTime = performance.loadEventEnd - performance.navigationStart;
      // console.log(`Page Load Time: ${pageLoadTime} ms`);

      console.log(
        obtainedMetrics,
        '1',
        performance,
        '2',
        navigationTimings,
        '3'
      );
    } catch (error) {
      await makeScreenshot(driverChrome, 'change_area_status_project');
      throw error;
    }
  });
});
const { createWebdriverChrom } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const ChangeAreaStatusInProjectProgress = require('../src/classes/view/area/changeAreaStatusInProjectProgress');
const WeightChange = require('../src/classes/statusAndWeight/weightChange');
const AddCommentToArea = require('../src/classes/view/area/addCommentToArea');
const { saveMetrics } = require('../src/utils/saveMetrics');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');
const { By, until } = require('selenium-webdriver');
const {onCLS, onINP, onLCP} = require ('web-vitals');

describe('Change task status by SU and measure metrics', async () => {

  let driverChrome = null;
  let SUManagerMeasure = { 'Time metrics for change area status, weight and add comments by SU': {} };

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('change task status by SU', async () => {
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const changeAreaStatus = new ChangeAreaStatusInProjectProgress(driverChrome);
    const weightChange = new WeightChange(driverChrome);
    const addCommentToArea = new AddCommentToArea(driverChrome);
   
    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailSU);
    await logginPageTest.fillPasswordInput(config.passwordSU);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      // await driverChrome.executeScript(() => {
      //   const script = document.createElement('script');
      //   script.src = 'https://unpkg.com/web-vitals@3.0.0/dist/web-vitals.iife.js';
      //   script.onload = function () {
      //     // When loading `web-vitals` using a classic script, all the public
      //     // methods can be found on the `webVitals` global namespace.
      //     webVitals.onCLS(console.log);
      //     webVitals.onINP(console.log);
      //     webVitals.onLCP(console.log);
      //   };
      //   document.head.appendChild(script);
      // });
      // await driverChrome.sleep(5000);
      await changeAreaStatus.goToView(config.projectNameMain, 'su');
      
      

      // Wait for web-vitals to be ready
      // await driverChrome.wait(until.con(async () => {
      //   const result = await driverChrome.executeScript(() => {
      //     console.log('Waiting for web-vitals to connect...');
      //     return typeof window.webVitals !== 'undefined';
      //   });
      //   return result;
      // }), 10000);

      
      await changeAreaStatus.goToSelektTab(config.projectProgress);
      await driverChrome.wait(until.elementsLocated(By.css(`.area-progress-list-areas__item[status-name="To Do"]`)), 20000);
      const areaElement = await driverChrome.findElement(By.css(`.area-progress-list-areas__item[status-name="To Do"]`));
      // let inpMetric
      // inpMetric = await driverChrome.executeAsyncScript((done) => {
      //   window.webVitals.getINP((metric) => {
      //     done(metric.value);
      //   });
      // });
    //   const date1 = await driverChrome.executeScript(() => {
    //     function logDelta({name, id, delta}) {
    //      console.log(`${name} matching ID ${id} changed by ${delta}`);
    //    };
    //    webVitals.onCLS(logDelta);
    //    webVitals.onINP(logDelta);
    //    webVitals.onLCP(logDelta);
    //  })
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
      // // Час на виконання скрипта

      const endTime = await driverChrome.executeScript('return window.nextPaintTime || performance.now();');
      const inp = endTime - startTime;
      console.log('Interaction to Next Paint (INP):', inp.toFixed(2), 'ms');
      await driverChrome.sleep(2000);
      // let inpTime;
      
      // console.log(date1);
      // console.log('LCP:', inpMetric);


      // const inpTime = await driverChrome.executeAsyncScript((done) => {
      //   window.webVitals.getINP((metric) => {
      //     done(metric.value);
      //   });
      // });

      // const clsTime = await driverChrome.executeAsyncScript((done) => {
      //   window.webVitals.getCLS((metric) => {
      //     done(metric.value);
      //   });
      // });

      // console.log('INP:', inpTime);

      // await driverChrome.sleep(15000);
 
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_change_status');
      throw error;
    }
  });

  // it('change task status by SU', async () => {
  //   await driverChrome.executeScript(`
  //     window.inpValue = 0;
  //     window.processingStartValue = 0;
  //     window.startTimeValue = 0;
  //     if (window.PerformanceObserver) {
  //       const observer = new PerformanceObserver((list) => {
  //         list.getEntries().forEach((entry) => {
  //           console.log(entry, 'metricssssss');
  //           window.inpValue = entry.processingStart - entry.startTime;
  //           window.processingStartValue = entry.processingStart;
  //           window.startTimeValue = entry.startTime;
  //         });
  //       });
  //       observer.observe({ type: 'first-input', buffered: true });
  //     }
  //   `);
  //   console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

  //   const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
  //   const changeAreaStatus = new ChangeAreaStatusInProjectProgress(driverChrome);
  //   const weightChange = new WeightChange(driverChrome);
  //   const addCommentToArea = new AddCommentToArea(driverChrome);

  //   await logginPageTest.openLoginForm();
  //   await logginPageTest.fillEmailInput(config.emailSU);
  //   await logginPageTest.fillPasswordInput(config.passwordSU);
  //   await logginPageTest.checkSaveForFuture();
  //   await logginPageTest.login(config.mainCompanyPage);

  //   try {
      

  //     let interactionTimes = {};

  //     const logInteractionTime = async (interactionName) => {
  //       const time = await driverChrome.executeScript('return performance.now();');
  //       interactionTimes[interactionName] = time;
  //       console.log(`${interactionName}: ${time}`);
  //     };

  //     await changeAreaStatus.goToView(config.projectNameMain, 'su');
  //     await logInteractionTime('goToView');

  //     await changeAreaStatus.goToSelektTab(config.projectProgress); 
  //     await logInteractionTime('goToSelektTab');

  //     const firstMeasure = await changeAreaStatus.findeAreaStatusClickAndMeasureMetric();
  //     await logInteractionTime('findeAreaStatusClickAndMeasureMetric');

  //     const secondMeasure = await changeAreaStatus.changeStatusToDoOnInProgressMeasureMetrics();
  //     await logInteractionTime('changeStatusToDoOnInProgressMeasureMetrics');

  //     await driverChrome.sleep(1000);

  //     const thirdMeasure = await weightChange.findeWeightAndChangeItMeasureMetrics(config.large);
  //     await logInteractionTime('findeWeightAndChangeItMeasureMetrics');

  //     await driverChrome.sleep(1000);

  //     const fourthMeasure = await addCommentToArea.addCommentMeasureMetrics(config.commentsSU);
  //     await logInteractionTime('addCommentMeasureMetrics');

  //     await driverChrome.sleep(1000);
  //     await addCommentToArea.deleteComment(config.commentsSU);

  //     await weightChange.findeWeightAndChangeIt(config.medium);
  //     await logInteractionTime('findeWeightAndChangeIt');

  //     await changeAreaStatus.changeStatusInProgressOnToDo();
  //     await logInteractionTime('changeStatusInProgressOnToDo');
      
  //     const inpValue = await driverChrome.executeScript('return window.inpValue;');
  //     const processingStartValue = await driverChrome.executeScript('return window.processingStartValue;');
  //     const startTimeValue = await driverChrome.executeScript('return window.startTimeValue;');

  //     console.log('Interaction to Next Paint (INP):', inpValue);
  //     console.log('Processing Start:', processingStartValue);
  //     console.log('Start Time:', startTimeValue);
      

  //     SUManagerMeasure['Time metrics for change area status, weight and add comments by SU'] =
  //     {
  //       ...firstMeasure,
  //       ...secondMeasure,
  //       ...thirdMeasure,
  //       ...fourthMeasure
  //     };

  //     saveMetrics(config.metricsFilePath, config.metricfileName, SUManagerMeasure);
  //     await driverChrome.sleep(1000);

  //   } catch (error) {
  //     await makeScreenshot(driverChrome, 'task_change_status');
  //     throw error;
  //   }
  // });
});
