const { createWebdriverChrom } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const CreateProject = require('../src/classes/project/createProject');
const RemoveProject = require('../src/classes/project/removeProject');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { saveMetrics } = require('../src/utils/saveMetrics');
const { describe } = require('mocha');
const config = require('../src/utils/config');
const { nanoid } = require('nanoid');

describe('Create, edit and remove project by the SA and measure metrics', async () => {
  // here add parameters for creation
  let driverChrome = null;
  let createProjectMesuer = { 'Time metrics for project creation by the SA': {} };

  const newProjectkey = 'B' + nanoid(2);
  const newProjectNumber = 'A' + nanoid(2);
  const newProjectStreet = 'Test2 new';
  const newProjectApp = '22';
  const newProjectZip = '02200';
  const newCompanyProjectBelong = 'Performance TST';
  const newProjectClientName = 'Auto Test';
  const newProjectState = 'New York';
  const newCompanProjectCity = 'New York';
  const startDate = '12.12.23';
  const eneDate = '12.12.25';
  

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('create new project', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createProjectTest = new CreateProject(driverChrome);
    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.email);
    await logginPageTest.fillPasswordInput(config.password);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.urlhomePageForCheck);

    try {
      const firstMeasure = await createProjectTest.goToProjectListMeasureTime();
      const secondMeasure =
        await createProjectTest.fillCreateProjectFieldsMeasureTime(
          config.companyName,
          newProjectkey,
          newProjectNumber,
          newCompanyProjectBelong,
          newProjectStreet,
          newProjectApp,
          newProjectState,
          newCompanProjectCity,
          newProjectZip,
          newProjectClientName,
          startDate,
          eneDate
        );
      const thirdMeasure =
        await createProjectTest.goToProjectDetailsPageMeasureTime(
          config.companyName
        );
      
        createProjectMesuer['Time metrics for project creation by the SA'] = {
        ...firstMeasure,
        ...secondMeasure,
        ...thirdMeasure,
      };
    
      saveMetrics(
          config.metricsFilePath,
          config.metricfileName,
          createProjectMesuer
      );

      // console.log(createProjectMesuer);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_create');
      throw error;
    }
  });

  it('remove project', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeProject = new RemoveProject(driverChrome);

    try {
      await logginPageTest.openLoginForm();
      await logginPageTest.fillEmailInput(config.email);
      await logginPageTest.fillPasswordInput(config.password);
      await logginPageTest.checkSaveForFuture();
      await logginPageTest.login(config.urlhomePageForCheck);

      await removeProject.goToProjectList();
      await removeProject.findProject(config.companyName, config.projectsPage);
      await removeProject.removefindProject(config.companyName);
    } catch (error) {
      await makeScreenshot(driverChrome, 'project_remove');
      throw error;
    }
  });
});
