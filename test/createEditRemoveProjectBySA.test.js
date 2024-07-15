const { browsers, createDriver } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const CreateProject = require('../src/classes/project/createProject');
const RemoveProject = require('../src/classes/project/removeProject');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { saveMetrics } = require('../src/utils/saveMetrics');
const { describe } = require('mocha');
const config = require('../src/utils/config');
const { nanoid } = require('nanoid');

browsers.forEach(({browser, bVersion, os}) => {
  describe(`Create, edit and remove project by the SA and measure metrics in the`, () => {
    // here add parameters for creation
    let driver = null;
    let testname = '';
    // let testname = `Create, edit and remove project by the SA and measure metrics in the ${browser}`
    let createProjectMesuer = {
      'Time metrics for project creation by the SA': {},
    };

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
      // testname = `Create, edit and remove project by the SA and measure metrics in the ${browser}`;
      driver = await createDriver(browser, bVersion, os);
    });

    afterEach(async () => {
      if (driver) {
        await driver.quit();
      }
    });

    it(`create new project`, async () => {
      testname = `Create new project in the ${browser}`;
      await driver.executeScript(`lambda-name=${testname}`);
      console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

      const logginPageTest = new LoginPage(driver, config.urlLoginPage);
      const createProjectTest = new CreateProject(driver);
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

        if (browser === "Safari") {
          saveMetrics(config.metricsFilePath, config.metricfileNameSafari, createProjectMesuer)
        } else {
           saveMetrics(config.metricsFilePath, config.metricfileNameChrom, createProjectMesuer)
        }
        await driver.executeScript("lambda-status=passed");
        // console.log(createProjectMesuer);
      } catch (error) {
        await makeScreenshot(driver, 'project_create');
        await driver.executeScript("lambda-status=failed");
        throw error;
      }
    });

    it(`remove project`, async () => {
      testname = `Remove new project in the ${browser}`;
      await driver.executeScript(`lambda-name=${testname}`);
      console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

      const logginPageTest = new LoginPage(driver, config.urlLoginPage);
      const removeProject = new RemoveProject(driver);

      try {
        await logginPageTest.openLoginForm();
        await logginPageTest.fillEmailInput(config.email);
        await logginPageTest.fillPasswordInput(config.password);
        await logginPageTest.checkSaveForFuture();
        await logginPageTest.login(config.urlhomePageForCheck);

        await removeProject.goToProjectList();
        await removeProject.findProject(config.companyName, config.projectsPage);
        await removeProject.removefindProject(config.companyName);
        await driver.executeScript("lambda-status=passed");
      } catch (error) {
        await makeScreenshot(driver, 'project_remove');
        await driver.executeScript("lambda-status=failed");
        throw error;
      }
    });
  });
});
