const { createWebdriverChrom } = require('../src/utils/webdriver');
const InviteUser = require('../src/classes/user/inviteUser');
const LoginPage = require('../src/classes/auth/login');
const RemoveUser = require('../src/classes/user/removeUser');
const makeScreenshot = require('../src/utils/makeScreenShot');
const { saveMetrics } = require('../src/utils/saveMetrics');
const { describe } = require('mocha');
const should = require('chai').should();
const config = require('../src/utils/config');

describe('Invite and remove user by the Company Admin and measure metrics', async () => {
  // time and site or lochalhost there tests are going
  let driverChrome = null;
  let inviteUserMeasure = { 'Time metrics for invite user by CA': {} };

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
    return;
  });

  it('invite user by the company admin', async () => {
    // await driverChrome.executeScript("document.body.style.zoom='50%'");

    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const inviteUserTest = new InviteUser(driverChrome);
    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailCA);
    await logginPageTest.fillPasswordInput(config.passwordCA);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      await inviteUserTest.goToView(config.projectNameMain, 'ca');
      await inviteUserTest.goToSelektTab(config.users);
      const firstMeasure =
        await inviteUserTest.openInviteUserFormInProjectMeasureTime();
      const secondMeasure = await inviteUserTest.fillInviteFormByCAMeasureTime(
        config.emailUseForTest,
        config.projManager
      );
      await inviteUserTest.checkCreateNewUser(config.emailUseForTest);
      inviteUserMeasure['Time metrics for invite user by CA'] = {
        ...firstMeasure,
        ...secondMeasure,
      };
      saveMetrics(
        config.metricsFilePath,
        config.metricfileName,
        inviteUserMeasure
      );
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_create_by_CA');
      throw error;
    }
  });

  it('remove user by the company admin', async () => {
    const logginPageTest = new LoginPage(driverChrome, config.urlLoginPage);
    const removeUserTest = new RemoveUser(driverChrome);
    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(config.emailCA);
    await logginPageTest.fillPasswordInput(config.passwordCA);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(config.mainCompanyPage);

    try {
      await removeUserTest.goToUserList('ca');
      await removeUserTest.findUser(
        config.emailUseForTest,
        config.mainCompanyUsersPage
      );
      await removeUserTest.removefindUser();
      await removeUserTest.checkIfUserRemove(
        config.emailUseForTest,
        config.mainCompanyUsersPage
      );
    } catch (error) {
      await makeScreenshot(driverChrome, 'user_remove_by_CA');
      throw error;
    }
  });
});
