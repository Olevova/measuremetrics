const {createWebdriverChrom} = require('../webdriver');
const LoginPage = require('../../classes/auth/login');
const CreateCompany = require("../../classes/company/createCompany");
const RemoveCompany = require("../../classes/company/RemoveCompany");
const makeScreenshot = require('../makeScreenShot');
const { describe } = require("mocha");
const should = require("chai").should();


describe("create and remove company in the chrom browser", async () => {
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

    let newConpanyName = 'RedWing';
    const newCompanyStreet = "Erdft2";
    const newCompanyApp = '15';
    const newCompanyZip = "23544";
    const newCompanyPhone = "+5231113456";
    const newCompanyEmail = "test1@test.com";
    const newCompanyType = "Hotel";
    const newCompanyState = "North Carolina"
    const newCompanyCity = "Apex"
    
    beforeEach(async()=>{

        driverChrome = await createWebdriverChrom()

    });

    afterEach(async()=>{

        if (driverChrome){
            await driverChrome.quit();
        }

    });
    
    it("create new company", async ()=>{
        // time and site or lochalhost there tests are going
        console.log(Date().toLocaleLowerCase(), 'date', URL);
        for(i=0; i<7; i+=1){
            newConpanyName = 'falcon3' + i
        const logginPageTest = new LoginPage(driverChrome, URL);
        const createCompany = new CreateCompany(driverChrome);
       
        await logginPageTest.openLoginForm();
        await logginPageTest.fillEmailInput(email);
        await logginPageTest.fillPasswordInput(password);
        await logginPageTest.checkSaveForFuture();
        await logginPageTest.login(urlForCheck);
        
        
       
        try {
            await createCompany.goToCreateCompanyForm();
            await createCompany.fillCreateCompany(
            newConpanyName ,
            newCompanyStreet,
            newCompanyApp,
            newCompanyState,
            newCompanyCity,
            newCompanyZip,
            newCompanyPhone,
            newCompanyEmail ,
            newCompanyType 
            );
            // await createCompany.checkCreationOfNewCompany(newConpanyName)
        
        } catch (error) {

            await makeScreenshot(driverChrome, 'company_create')
            throw error

        }
        
    }
    });

    // it('remove company', async()=>{
        
    //     const logginPageTest = new LoginPage(driverChrome, URL);
    //     const removeCompany = new RemoveCompany(driverChrome);

    //     try {

    //         await logginPageTest.openLoginForm();
    //         await logginPageTest.fillEmailInput(email);
    //         await logginPageTest.fillPasswordInput(password);
    //         await logginPageTest.checkSaveForFuture();
    //         await logginPageTest.login(urlForCheck);
    
    //         await removeCompany.goToCompanyList();
    //         await removeCompany.findCompany(newConpanyName, companiesPage);
    //         await removeCompany.removefindCompany(newConpanyName);
          
    //     } catch (error) {
            
    //         await makeScreenshot(driverChrome, 'company_remove');
    //         throw error
    //     }
       
        
    // })


})