const { browsers, createDriver } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const ChangeAreaStatusInProjectProgress = require('../src/classes/view/area/changeAreaStatusInProjectProgress');
const WeightChange = require('../src/classes/statusAndWeight/weightChange');
const AddCommentToArea = require('../src/classes/view/area/addCommentToArea');
const { saveMetrics } = require('../src/utils/saveMetrics');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

describe('Change task status by SU and measure metrics', async () => {

  browsers.forEach(({browser, bVersion, os})=>{
  let driver = null;
  let SUManagerMeasure = { 'Time metrics for change area status, weight and add comments by SU': {} };

  let testname = `Change task status by SU and measure metrics in ${browser}`

  beforeEach(async () => {
    driver = await createDriver(browser, bVersion, os, testname);
  });

  afterEach(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it(`change task status by SU in the ${browser}`, async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driver, config.urlLoginPage);
    const changeAreaStatus = new ChangeAreaStatusInProjectProgress(driver);
    const weightChange = new WeightChange(driver);
    const addCommentToArea = new AddCommentToArea(driver);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailSU);
    await logginPageTest.fillPasswordInput(config.passwordSU);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
    //   await changeTaskStatus.goToTasksList(config.projectNameMain);
    
       
      await changeAreaStatus.goToView(config.projectNameMain, 'su'); 
      await changeAreaStatus.goToSelektTab(config.projectProgress); 
      const firstMeasure =  await changeAreaStatus.findeAreaStatusClickAndMeasureMetric();
      const secondMeasure = await changeAreaStatus.changeStatusToDoOnInProgressMeasureMetrics();
      await driver.sleep(1000);
      const thirdMeasure = await weightChange.findeWeightAndChangeItMeasureMetrics(config.large);
      await driver.sleep(1000);
      const fourthMeasure = await addCommentToArea.addCommentMeasureMetrics(config.commentsSU);
      await driver.sleep(1000);
      await addCommentToArea.deleteComment(config.commentsSU);
      await weightChange.findeWeightAndChangeIt(config.medium);
      await changeAreaStatus.changeStatusInProgressOnToDo();
      
      SUManagerMeasure['Time metrics for change area status, weight and add comments by SU']=
      {
        ...firstMeasure,
        ...secondMeasure,
        ...thirdMeasure,
        ...fourthMeasure
      }
      if(browser === "Safari" ){
        saveMetrics(config.metricsFilePath, config.metricfileNameSafari,SUManagerMeasure)
      } else{
        saveMetrics(config.metricsFilePath, config.metricfileNameChrom,SUManagerMeasure)
      }
      await driver.executeScript("lambda-status=passed");
      await driver.sleep(1000);
 
    } catch (error) {
      await makeScreenshot(driver, 'task_change_status');
      await driver.executeScript("lambda-status=failed");
      throw error;
    }
  });
})
});
