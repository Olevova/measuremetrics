const {createWebdriverChrom} = require("../webdriver");
const InviteUserByAdmin = require("../../classes/user/InviteUserByAdmin");
const LoginPage = require("../../classes/auth/login");
const RemoveUser = require("../../classes/user/removeUser");
const makeScreenshot = require('../makeScreenShot');
const { describe } = require("mocha");
const should = require("chai").should();
const {Builder, Key} = require('selenium-webdriver');

describe("invite and remove user test", async ()=>{
    // const URL = 'http://localhost:4200/login';
    // const urlForCheck = "http://localhost:4200/system/company/1";
    // const usersPage = 'http://localhost:4200/system/users';
    const usersPage = 'https://dev-frontend.colorjob.terenbro.com/system/users'
    const URL = 'https://dev-frontend.colorjob.terenbro.com/login';
    const urlForCheck = "https://dev-frontend.colorjob.terenbro.com/system/company/2"
    const email = "olevova1983@gmail.com";
    const password ="80601033" ;
    const emailUser = 'test521@test.com';
    let driverChrome = null;

    beforeEach(async()=>{

        driverChrome = await createWebdriverChrom();

    });

    afterEach(async()=>{

        if(driverChrome){
            await driverChrome.quit()
        }
        return

    });

    it("invite user", async()=>{

        // await driverChrome.executeScript("document.body.style.zoom='50%'");
    
        const logginPageTest = new LoginPage(driverChrome, URL);
        const inviteUserTest = new InviteUserByAdmin(driverChrome);
        await logginPageTest.openLoginForm();
        await logginPageTest.fillEmailInput(email);
        await logginPageTest.fillPasswordInput(password);
        await logginPageTest.checkSaveForFuture();
        await logginPageTest.login(urlForCheck);

        try {
            await inviteUserTest.goToUsersList();
            await inviteUserTest.fillInviteForm(emailUser, "test1", "employee");
            // await inviteUserTest.checkNewUser(emailUser, usersPage)
            // await driverChrome.sleep(2000)
        } catch (error) {
            await makeScreenshot(driverChrome, 'user_create')
            throw error
        }
   

    });

    // it("remove user", async()=>{

    //     const logginPageTest = new LoginPage(driverChrome, URL);
    //     const removeUserTest = new RemoveUser(driverChrome);
    //     await logginPageTest.openLoginForm();
    //     await logginPageTest.fillEmailInput(email);
    //     await logginPageTest.fillPasswordInput(password);
    //     await logginPageTest.checkSaveForFuture();
    //     await logginPageTest.login(urlForCheck);

    //     try {
    //         await removeUserTest.goToUserList();
    //         await removeUserTest.findUser(emailUser, usersPage);
    //         await removeUserTest.removefindUser();
    //         await removeUserTest.checkIfUserRemove(emailUser, usersPage)
    //     } catch (error) {
    //         await makeScreenshot(driverChrome, 'user_remove')
    //         throw error
    //     }
     

    // })


})
