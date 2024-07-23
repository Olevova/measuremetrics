const {
  browsers,
  createDriver,
  isRunningInTeamCity,
  isRunningInDocker,
} = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const CreateProject = require('../src/classes/project/createProject');
const RemoveProject = require('../src/classes/project/removeProject');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { saveMetrics } = require('../src/utils/saveMetrics');
const { describe } = require('mocha');
const config = require('../src/utils/config');
const { nanoid } = require('nanoid');

const runTests = (browser, bVersion, os) => {
  describe(`Create, edit and remove project by the SA and measure metrics in ${browser}`, () => {
    let driver = null;
    let testname = '';
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
      driver = await createDriver(browser, bVersion, os);
    });

    afterEach(async () => {
      if (driver) {
        await driver.quit();
      }
    });

    it(`create new project`, async () => {
      if (isRunningInDocker || isRunningInTeamCity) {
        testname = `Create new project in ${browser}`;
        await driver.executeScript(`lambda-name=${testname}`);
      }
      console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

      const logginPageTest = new LoginPage(driver, config.urlLoginPage);
      const createProjectTest = new CreateProject(driver);
      await logginPageTest.openLoginForm();
      await logginPageTest.fillEmailInput(config.email);
      await logginPageTest.fillPasswordInput(config.password);
      await logginPageTest.checkSaveForFuture();
      await logginPageTest.login(config.urlhomePageForCheck);

      try {
        const firstMeasure =
          await createProjectTest.goToProjectListMeasureTime();
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

        if (browser === 'Safari') {
          saveMetrics(
            config.metricsFilePath,
            config.metricfileNameSafari,
            createProjectMesuer
          );
        } else {
          saveMetrics(
            config.metricsFilePath,
            config.metricfileNameChrom,
            createProjectMesuer
          );
        }
        if (isRunningInDocker || isRunningInTeamCity) {
          await driver.executeScript('lambda-status=passed');
        }
      } catch (error) {
        await makeScreenshot(driver, 'project_create');
        if (isRunningInDocker || isRunningInTeamCity) {
          await driver.executeScript('lambda-status=failed');
        }
        throw error;
      }
    });

    it(`remove project`, async () => {
      if (isRunningInDocker || isRunningInTeamCity) {
        testname = `Remove new project in ${browser}`;
        await driver.executeScript(`lambda-name=${testname}`);
      }
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
        await removeProject.findProject(
          config.companyName,
          config.projectsPage
        );
        await removeProject.removefindProject(config.companyName);
        if (isRunningInDocker || isRunningInTeamCity) {
          await driver.executeScript('lambda-status=passed');
        }
      } catch (error) {
        await makeScreenshot(driver, 'project_remove');
        if (isRunningInDocker || isRunningInTeamCity) {
          await driver.executeScript('lambda-status=failed');
        }
        throw error;
      }
    });
  });
};

if (isRunningInDocker || isRunningInTeamCity) {
  browsers.forEach(({ browser, bVersion, os }) => {
    runTests(browser, bVersion, os);
  });
} else {
  runTests('Chrome', '125', 'local');
}
