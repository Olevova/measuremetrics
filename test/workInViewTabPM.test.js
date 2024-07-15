const { browsers, createDriver } = require('../src/utils/webdriver');
const LoginPage = require('../src/classes/auth/login');
const CreateUnit = require('../src/classes/view/unit/createUnit');
const DeleteUnit = require('../src/classes/view/unit/deleteUnit');
const CreateRoom = require('../src/classes/view/room/createRoom');
const DeleteRoom = require('../src/classes/view/room/deleteRoom');
const RoomTemplate = require('../src/classes/view/room/roomTemplate');
const DuplicateUnit = require('../src/classes/view/unit/duplicateUnit');
const CreateTask = require('../src/classes/task/createTask');
const FilterTaskByStatus = require('../src/classes/task/filterTaskByStatus');
const RemoveTask = require('../src/classes/task/removeTask');
const { saveMetrics } = require('../src/utils/saveMetrics');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { describe } = require('mocha');
const config = require('../src/utils/config');
const { nanoid } = require('nanoid');

browsers.forEach(({ browser, bVersion, os }) => {
describe('measuring time metrics for PM', async () => {
  
    let driver = null;
    let testname = ``
    let PMManagerMeasure = {
      'Time metrics for creating unique room, template room, unit and duplicate unit, create task by PM':
        {},
    };
    
    const newRoomName = 'tr' + nanoid(5);

    beforeEach(async () => {
      driver = await createDriver(browser, bVersion, os);
    });

    afterEach(async () => {
      if (driver) {
        await driver.quit();
      }
    });

    it('Measure time needed to create unique room, template room, unit and duplicate unit by PM', async () => {
      // time and site or lochalhost there tests are going
      testname = `Measure time needed to create unique room, template room, unit and duplicate unit by PM in the ${browser}`
      await driver.executeScript(`lambda-name=${testname}`);
      
      console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

      const logginPageTest = new LoginPage(driver, config.urlLoginPage);
      const createUnit = new CreateUnit(driver);
      const createRoom = new CreateRoom(driver);
      const roomTemplate = new RoomTemplate(driver);
      const duplicateUnit = new DuplicateUnit(driver);
      const deleteRoom = new DeleteRoom(driver);
      const deleteUnit = new DeleteUnit(driver);

      await logginPageTest.openLoginForm();
      await logginPageTest.fillEmailInput(config.emailPM);
      await logginPageTest.fillPasswordInput(config.passwordPM);
      await logginPageTest.checkSaveForFuture();
      await logginPageTest.login(config.mainCompanyPage);

      try {
        const firstMeasure = await createUnit.goToViewAndCheckMetrics(
          config.projectNameMain,
          config.projManager
        );
        const secondMeasure = await createRoom.createRoomMeasureMetrics(
          '_',
          newRoomName,
          config.newAreaNamePM
        );
        console.log(secondMeasure, 'firstMeasure');
        const thirdMeasure =
          await createRoom.openCtreateRoomFormViaTemplateMeasureMetrics(
            '_',
            config.templateRoomPM
          );
        const fourthMeasure =
          await roomTemplate.openEditTemplateFormMeasureMetrics(
            '_',
            config.templateRoomPM
          );
        const fifthMeasure = await createUnit.createUnitAndCheckMetrics(
          config.unitNamePM
        );
        await createUnit.checkCreateUnit(config.unitNamePM);
        const sixthMeasure = await duplicateUnit.duplicateUnitMeasureMetric();
        PMManagerMeasure[
          'Time metrics for creating unique room, template room, unit and duplicate unit, create task by PM'
        ] = {
          ...firstMeasure,
          ...secondMeasure,
          ...thirdMeasure,
          ...fourthMeasure,
          ...fifthMeasure,
          ...sixthMeasure,
        };
        if (browser === 'Safari') {
          saveMetrics(
            config.metricsFilePath,
            config.metricfileNameSafari,
            PMManagerMeasure
          );
        } else {
          saveMetrics(
            config.metricsFilePath,
            config.metricfileNameChrom,
            PMManagerMeasure
          );
        }
        await deleteUnit.deleteUnit(config.duplicateUnitNamePM);
        await deleteUnit.checkDeleteUnit(config.duplicateUnitNamePM);
        await deleteUnit.deleteUnit(config.unitNamePM);
        await deleteUnit.checkDeleteUnit(config.unitNamePM);
        await deleteRoom.deleteRoom(newRoomName);
        await deleteRoom.checkDeleteFloor(newRoomName);
        if (browser === 'Safari') {
          saveMetrics(
            config.metricsFilePath,
            config.metricfileNameSafari,
            PMManagerMeasure
          );
        } else {
          saveMetrics(
            config.metricsFilePath,
            config.metricfileNameChrom,
            PMManagerMeasure
          );
        }
        await driver.executeScript('lambda-status=passed');
        await driver.sleep(1000);
      } catch (error) {
        await makeScreenshot(driver, 'unit_create');
        await driver.executeScript('lambda-status=failed');
        throw error;
      }
    });

    it('PM creates the task on Tasks tab within the Project and measure metrics', async () => {
      // time and site or lochalhost there tests are going
      testname = `PM creates the task on Tasks tab within the Project and measure metrics in the ${browser}`
      await driver.executeScript(`lambda-name=${testname}`);
      console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

      const logginPageTest = new LoginPage(driver, config.urlLoginPage);
      const createTask = new CreateTask(driver);
      const filterTask = new FilterTaskByStatus(driver);
      const removeTask = new RemoveTask(driver);

      await logginPageTest.openLoginForm();
      await logginPageTest.fillEmailInput(config.emailPM);
      await logginPageTest.fillPasswordInput(config.passwordPM);
      await logginPageTest.checkSaveForFuture();
      await logginPageTest.login(config.mainCompanyPage);

      try {
        await createTask.goToView(config.projectNameMain, 'pm');
        await createTask.goToSelektTab('Tasks');
        const firstMeasure = await createTask.fillCreateTaskMeasureMetrics(
          config.newFirstTaskNamePM,
          config.newTaskDescriptionPM,
          config.newTaskDueDataPM
        );
        const secondMeasure = await createTask.clickHideBtnAndMeasureMetrics();
        const thirdMeasure = await filterTask.filterTasksByStatusMeasureMetrics(
          'done'
        );
        PMManagerMeasure[
          'Time metrics for creating unique room, template room, unit and duplicate unit, create task by PM'
        ] = {
          ...PMManagerMeasure[
            'Time metrics for creating unique room, template room, unit and duplicate unit, create task by PM'
          ],
          ...firstMeasure,
          ...secondMeasure,
          ...thirdMeasure,
        };
        await removeTask.taskRemove(config.newFirstTaskNamePM);
        // console.log(firstMesure, 'firstMesure', secondMesure, 'secondMesure', thirdMesure, 'thirdMesure');
        console.log(PMManagerMeasure, 'createTaskManagerMeasure');
        if (browser === 'Safari') {
          saveMetrics(
            config.metricsFilePath,
            config.metricfileNameSafari,
            PMManagerMeasure
          );
        } else {
          saveMetrics(
            config.metricsFilePath,
            config.metricfileNameChrom,
            PMManagerMeasure
          );
        }
        await driver.executeScript('lambda-status=passed');
        await driver.sleep(1000);
      } catch (error) {
        await makeScreenshot(driver, 'task_create');
        await driver.executeScript('lambda-status=failed');
        throw error;
      }
    });
  });
});
