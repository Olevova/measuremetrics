const { createWebdriverChrom } = require('../webdriver');
const InviteUser = require('../../classes/user/inviteUser');
const LoginPage = require('../../classes/auth/login');
const RemoveUser = require('../../classes/user/removeUser');
const makeScreenshot = require('../makeScreenShot');
const { describe } = require('mocha');
const should = require('chai').should();
const { Builder, Key } = require('selenium-webdriver');

describe('invite user by the project manager and check the counter of avaliable invitations test-cases in the PM 189', async () => {
  // const URL = 'http://localhost:4200/login';
  // const urlForCheck = "http://localhost:4200/system/dashboard";
  // const usersPage = 'http://localhost:4200/system/users';
  const usersPage = 'https://dev-frontend.colorjob.terenbro.com/system/users';
  const userPageCA =
    'https://dev-frontend.colorjob.terenbro.com/system/company/643/users';
  const URL = 'https://dev-frontend.colorjob.terenbro.com/login';
  const urlForCheck =
    'https://dev-frontend.colorjob.terenbro.com/system/dashboard';
  const urlForCheckCA =
    'https://dev-frontend.colorjob.terenbro.com/system/company/643';

  const emailPM = 'Oleksiyukvolodymyr@gmail.com';
  const passwordPM = '222222';
  const emailUserCA = 'testCounter@test.com';
  let driverChrome = null;

  beforeEach(async () => {
    driverChrome = await createWebdriverChrom();
  });

  afterEach(async () => {
    if (driverChrome) {
      await driverChrome.quit();
    }
    return;
  });

  it('invite user by the project manager and check the counter of avaliable invitations test-cases in the PM 189', async () => {
    // await driverChrome.executeScript("document.body.style.zoom='50%'");

    const logginPageTest = new LoginPage(driverChrome, URL);
    const inviteUserTest = new InviteUser(driverChrome);
    await logginPageTest.openLoginForm();
    await logginPageTest.fillEmailInput(emailPM);
    await logginPageTest.fillPasswordInput(passwordPM);
    await logginPageTest.checkSaveForFuture();
    await logginPageTest.login(urlForCheckCA);

    try {
      await inviteUserTest.checkNumberOfUsersInUsersList('pm');
      await inviteUserTest.checkAvailibleNumberOfUsersInInviteForm();

      //   await inviteUserTest.checkCreateNewUser(emailUserCA);
    } catch (error) {
      await makeScreenshot(driverChrome, 'check_avaliable_invitations');
      throw error;
    }
  });
});
