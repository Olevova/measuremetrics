const {createWebdriverChrom} = require('../webdriver');
const LoginPage = require('../../classes/auth/login');
const CreateUnit = require('../../classes/view/unit/createUnit');
const DeleteUnit = require('../../classes/view/unit/deleteUnit');
const EditUnit = require('../../classes/view/unit/editUnit');
const makeScreenshot = require('../makeScreenShot');
const { describe } = require("mocha");
const should = require("chai").should();


describe("create, edit and remove Unit in the chrom browser", async () => {
    // here add parameters for creation 
    let driverChrome = null;

    // const URL = 'http://frontend-cj:4200/login'; 
    // const urlForCheck = "http://frontend-cj:4200/system/dashboard";
    // const companiesPage = 'http://frontend-cj:4200/system/companies';

    const companiesPage = 'https://dev-frontend.colorjob.terenbro.com/system/companies';
    const URL = 'https://dev-frontend.colorjob.terenbro.com/login';
    const urlForCheck = "https://dev-frontend.colorjob.terenbro.com/system/dashboard"
    const email = "superadmin@gmail.com";
    const password ="colorjob" ;

    const newUnitName = 'testUnit';
    const editUnitName = 'test2';
  
    
    beforeEach(async()=>{

        driverChrome = await createWebdriverChrom()

    });

    afterEach(async()=>{

        if (driverChrome){
            await driverChrome.quit();
        }

    });

    it("create new unit", async ()=>{
        // time and site or lochalhost there tests are going
        console.log(Date().toLocaleLowerCase(), 'date', URL);

        const logginPageTest = new LoginPage(driverChrome, URL);
        const createUnit = new CreateUnit(driverChrome);
       
        await logginPageTest.openLoginForm();
        await logginPageTest.fillEmailInput(email);
        await logginPageTest.fillPasswordInput(password);
        await logginPageTest.checkSaveForFuture();
        await logginPageTest.login(urlForCheck);
        
       
        try {

            await createUnit.goToView();
            await createUnit.createUnit(newUnitName);
            await createUnit.checkCreateUnit(newUnitName);      
        
        } catch (error) {

            await makeScreenshot(driverChrome, 'unit_create')
            throw error

        }
       
    });

    it("edit new unit", async ()=>{
        // time and site or lochalhost there tests are going
        console.log(Date().toLocaleLowerCase(), 'date', URL);

        const logginPageTest = new LoginPage(driverChrome, URL);
        const editUnit = new EditUnit(driverChrome);
       
        await logginPageTest.openLoginForm();
        await logginPageTest.fillEmailInput(email);
        await logginPageTest.fillPasswordInput(password);
        await logginPageTest.checkSaveForFuture();
        await logginPageTest.login(urlForCheck);
        
        
        try {

            await editUnit.goToView();
            await editUnit.editUnit(newUnitName,editUnitName);
            await editUnit.checkCreateUnit(editUnitName);       
        
        } catch (error) {

            await makeScreenshot(driverChrome, 'unit_edit')
            throw error

        }
       
    });

    

    it("delete new unit", async ()=>{
        // time and site or lochalhost there tests are going
        console.log(Date().toLocaleLowerCase(), 'date', URL);

        const logginPageTest = new LoginPage(driverChrome, URL);
        const deleteUnit = new DeleteUnit(driverChrome);
       
        await logginPageTest.openLoginForm();
        await logginPageTest.fillEmailInput(email);
        await logginPageTest.fillPasswordInput(password);
        await logginPageTest.checkSaveForFuture();
        await logginPageTest.login(urlForCheck);
        
         
        try {

            await deleteUnit.goToView();
            await deleteUnit.deleteUnit(editUnitName);
            await deleteUnit.checkDeleteUnit(editUnitName);
            
        
        } catch (error) {

            await makeScreenshot(driverChrome, 'unit_delete')
            throw error

        }
       
    });

})