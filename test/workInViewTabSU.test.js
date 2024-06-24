const { createWebdriverChrom } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const ChangeAreaStatusInProjectProgress = require('../src/classes/view/area/changeAreaStatusInProjectProgress');
const WeightChange = require('../src/classes/statusAndWeight/weightChange');
const AddCommentToArea = require('../src/classes/view/area/addCommentToArea');
const { saveMetrics } = require('../src/utils/saveMetrics');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');

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
    // time and site or lochalhost there tests are going
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
    //   await changeTaskStatus.goToTasksList(config.projectNameMain);
      
      await changeAreaStatus.goToView(config.projectNameMain, 'su'); 
      await changeAreaStatus.goToSelektTab(config.projectProgress); 
      const firstMeasure =  await changeAreaStatus.findeAreaStatusClickAndMeasureMetric();
      const secondMeasure = await changeAreaStatus.changeStatusToDoOnInProgressMeasureMetrics();
      const thirdMeasure = await weightChange.findeWeightAndChangeItMeasureMetrics(config.large);
      const fourthMeasure = await addCommentToArea.addCommentMeasureMetrics(config.commentsSU);
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
      saveMetrics(config.metricsFilePath, config.metricfileName,SUManagerMeasure)
      await driverChrome.sleep(1000);
 
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_change_status');
      throw error;
    }
  });
});
