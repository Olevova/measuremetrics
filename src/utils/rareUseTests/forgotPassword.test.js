const ForgotPassword = require("../src/classes/forgotPassword");
const {createWebdriverChrom} = require("../webdriver");
const { describe } = require("mocha");
const {By, until} = require('selenium-webdriver');
const makeScreenshot = require('../makeScreenShot');
const should = require("chai").should();



describe("forgot password chrome", async () => {
  let driverChrome = null;

  const email = "superadmin@gmail.com";
  const comperaUrl = 'https://dev-frontend.colorjob.terenbro.com/login';
  // const comperaUrl = 'http://localhost:4200/login';


  beforeEach(async () => {

      try {

        driverChrome = await createWebdriverChrom();
        // const source = await driverChrome.getSession();
        // const source2 = await driverChrome.onLogEvent();
        // console.log(source, source2);
        
        // console.log(Network, Page);
      } catch (error) {

        console.log(error.message);

      }
    
  });

  afterEach(async () => {

      // await client.close();
      if (driverChrome){
            await driverChrome.quit();
        }


  });

  it("forgot passsord Coloradojob chrome", async () => {

    const forgotPasswordTest = new ForgotPassword(driverChrome);

    await forgotPasswordTest.openFogotPasswordForm(comperaUrl);
    await forgotPasswordTest.changePassword(email);
    await forgotPasswordTest.changePasswordCancel();

    const currentUrl = await forgotPasswordTest.currentUrl();
    console.log(currentUrl);
  //   await driverChrome.manage().getCookie().then(function(cookie) {
  //     console.log('cookie details => ', cookie);
  // });
    // const source = await driverChrome.onLogEvent();
    //     console.log(source);

    if (currentUrl !== comperaUrl) {
      makeScreenshot(driverChrome, 'forgotpassword');
    }

    currentUrl.should.to.equal(comperaUrl);

  });


});
