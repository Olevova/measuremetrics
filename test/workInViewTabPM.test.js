const { createWebdriverChrom } = require('../src/utils/webdriver');
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

describe('measuring time metrics for PM', async () => {
  // here add parameters for creation
  let driverChrome = null;
  let PMManagerMeasure = { 'Time metrics for creating unique room, template room, unit and duplicate unit, create task by PM': {} };

  const newRoomName = 'tr' + nanoid(5);

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
  });

  it('Measure time needed to create unique room, template room, unit and duplicate unit by PM', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createUnit = new CreateUnit(driverChrome);
    const createRoom = new CreateRoom(driverChrome);
    const roomTemplate = new RoomTemplate(driverChrome);
    const duplicateUnit = new DuplicateUnit(driverChrome);
    const deleteRoom = new DeleteRoom(driverChrome);
    const deleteUnit = new DeleteUnit(driverChrome);

    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailPM);
    await logginPageTest.fillPasswordInput(config.passwordPM);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      const firstMeasure = await createUnit.goToViewAndCheckMetrics(config.projectNameMain, config.projManager);
      const secondMeasure = await createRoom.createRoomMeasureMetrics('_', newRoomName, config.newAreaNamePM);
      await createRoom.checkCreateNewRoom(newRoomName);
      const thirdMeasure = await createRoom.openCtreateRoomFormViaTemplateMeasureMetrics('_', config.templateRoomPM);
      const fourthMeasure = await roomTemplate.openEditTemplateFormMeasureMetrics('_', config.templateRoomPM);
      const fifthMeasure = await createUnit.createUnitAndCheckMetrics(config.unitNamePM);
      await createUnit.checkCreateUnit(config.unitNamePM);
      const sixthMeasure = await duplicateUnit.duplicateUnitMeasureMetric();
      PMManagerMeasure['Time metrics for creating unique room, template room, unit and duplicate unit, create task by PM'] =
      {
        ...firstMeasure,
        ...secondMeasure,
        ...thirdMeasure,
        ...fourthMeasure,
        ...fifthMeasure,
        ...sixthMeasure
      };
      saveMetrics(config.metricsFilePath, config.metricfileName, PMManagerMeasure);
      console.log(PMManagerMeasure, 'createProjectManagerMesuer');
      await deleteUnit.deleteUnit(config.duplicateUnitNamePM);
      await deleteUnit.checkDeleteUnit(config.duplicateUnitNamePM);
      await deleteUnit.deleteUnit(config.unitNamePM);
      await deleteUnit.checkDeleteUnit(config.unitNamePM);
      await deleteRoom.deleteRoom(newRoomName);
      await deleteRoom.checkDeleteFloor(newRoomName);

    } catch (error) {
      await makeScreenshot(driverChrome, 'unit_create');
      throw error;
    }
  });

  it('PM creates the task on Tasks tab within the Project and measure metrics', async () => {
    // time and site or lochalhost there tests are going
    console.log(Date().toLocaleLowerCase(), 'date', config.urlLoginPage);

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const createTask = new CreateTask(driverChrome);
    const filterTask = new FilterTaskByStatus(driverChrome);
    const removeTask = new RemoveTask(driverChrome);

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
      PMManagerMeasure['Time metrics for creating unique room, template room, unit and duplicate unit, create task by PM'] = {
        ...PMManagerMeasure['Time metrics for creating unique room, template room, unit and duplicate unit, create task by PM'],
        ...firstMeasure,
        ...secondMeasure,
        ...thirdMeasure,
      };
      await removeTask.taskRemove(config.newFirstTaskNamePM);
      // console.log(firstMesure, 'firstMesure', secondMesure, 'secondMesure', thirdMesure, 'thirdMesure');
      console.log(PMManagerMeasure, 'createTaskManagerMeasure');
      saveMetrics(
        config.metricsFilePath,
        config.metricfileName,
        PMManagerMeasure
      );
    } catch (error) {
      await makeScreenshot(driverChrome, 'task_create');
      throw error;
    }
  });
});
