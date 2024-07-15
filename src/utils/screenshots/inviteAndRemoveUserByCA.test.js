const { browsers, createDriver } = require('../webdriver');
const InviteUser = require('../../classes/user/inviteUser');
const LoginPage = require('../../classes/auth/login');
const RemoveUser = require('../../classes/user/removeUser');
const makeScreenshot = require('../makeScreenShot');
const { saveMetrics } = require('../saveMetrics');
const { describe } = require('mocha');
const should = require('chai').should();
const config = require('../config');

browsers.forEach(({ browser, bVersion, os }) => {
  describe('Invite and remove user by the Company Admin and measure metrics', async () => {
    // time and site or lochalhost there tests are going

    let driver = null;
    let inviteUserMeasure = { 'Time metrics for invite user by CA': {} };
    let testname = ``;

    beforeEach(async () => {
      driver = await createDriver(browser, bVersion, os);
    });

    afterEach(async () => {
      if (driver) {
        await driver.quit();
      }
      return;
    });

    it('invite user by the company admin', async () => {
      // await driver.executeScript("document.body.style.zoom='50%'");
      testname = `Invite user by the company admin in the ${browser}`;
      await driver.executeScript(`lambda-name=${testname}`);
      const logginPageTest = new LoginPage(driver, config.urlLoginPage);
      const inviteUserTest = new InviteUser(driver);
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
        const secondMeasure =
          await inviteUserTest.fillInviteFormByCAMeasureTime(
            config.emailUseForTest,
            config.projManager
          );
        await inviteUserTest.checkCreateNewUser(config.emailUseForTest);
        inviteUserMeasure['Time metrics for invite user by CA'] = {
          ...firstMeasure,
          ...secondMeasure,
        };
        if (browser === 'Safari') {
          saveMetrics(
            config.metricsFilePath,
            config.metricfileNameSafari,
            inviteUserMeasure
          );
        } else {
          saveMetrics(
            config.metricsFilePath,
            config.metricfileNameChrom,
            inviteUserMeasure
          );
        }
        await driver.executeScript('lambda-status=passed');
      } catch (error) {
        await makeScreenshot(driver, 'user_create_by_CA');
        await driver.executeScript('lambda-status=failed');
        throw error;
      }
    });

    it('remove user by the company admin', async () => {
      testname = `Remove user by the company admin in the ${browser}`;
      await driver.executeScript(`lambda-name=${testname}`);

      const logginPageTest = new LoginPage(driver, config.urlLoginPage);
      const removeUserTest = new RemoveUser(driver);
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
        await driver.executeScript('lambda-status=passed');
      } catch (error) {
        await makeScreenshot(driver, 'user_remove_by_CA');
        await driver.executeScript('lambda-status=failed');
        throw error;
      }
    });
  });
});
