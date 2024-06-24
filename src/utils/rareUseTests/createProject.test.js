const {createWebdriverChrom} = require('../webdriver');
const LoginPage = require('../classes/login');
const CreateProject = require("../classes/createProject");
const RemoveProject = require("../classes/removeProject")
const makeScreenshot = require('../makeScreenShot');
const { describe } = require("mocha");
const should = require("chai").should();
const {By, until} = require('selenium-webdriver');


describe("create and remove project in the chrom browser", async () => {
    // here add parameters for creation 

    let driverChrome = null;
    // const URL = 'http://localhost:4400/login';
    // const urlForCheck = "http://localhost:4400/system/dashboard";
    // const projectsPage =  'http://localhost:4400/system/projects';
    const projectsPage = 'https://dev-frontend.colorjob.terenbro.com/system/projects';
    const URL = 'https://dev-frontend.colorjob.terenbro.com/login';
    const urlForCheck = "https://dev-frontend.colorjob.terenbro.com/system/dashboard"
    const email = "superadmin@gmail.com";
    const password ="colorjob" ;
    const successMessage = 'No such company in the list of company'

    const newProjectName = 'Test13';
    const newProjectNumber = '1312'
    const street = "Test2";
    const app = 'Test';
    const zipcode = "00000";
    const company = "terenbro1";
    const newProjectClientName = "test13";
    const state = "New York";
    const city = "New York";
    const startDate = '12.12.23';
    const eneDate= '12.12.24';
    
    beforeEach(async()=>{

        driverChrome = await createWebdriverChrom()

    });

    afterEach(async()=>{

        if (driverChrome){
            await driverChrome.quit();
        }
    });

    it("create new project", async ()=>{
        // time and site or lochalhost there tests are going
        console.log(Date().toLocaleLowerCase(), 'date', URL);
        const logginPageTest = new LoginPage(driverChrome, URL);
        const CreateProjectTest = new CreateProject(driverChrome);
       
        await logginPageTest.openLoginForm();
        await logginPageTest.fillEmailInput(email);
        await logginPageTest.fillPasswordInput(password);
        await logginPageTest.checkSaveForFuture();
        await logginPageTest.login(urlForCheck);
        
        let name = 'Test33'
        let namber = '33'
        
        for (index = 0; index < 20; ++index){
            
            const projectBtn = await driverChrome.findElement(By.id('linkProjects'));
            await projectBtn.click();

        const creatProject = driverChrome.findElement(By.id('btnCreate'));
        await creatProject.click();
        const projectName = await driverChrome.findElement(By.id("projectName"));
        await projectName.sendKeys(name);

        const projectNumber = await driverChrome.findElement(By.id("projectNumber"));
        await projectNumber.sendKeys(namber);

        const companyProjectBelong =  await driverChrome.findElement(By.id('projectSelectCompany'));
        await companyProjectBelong.click();
        
        await driverChrome.executeScript('return document.readyState');
       
        // await CreateProject.waitListDate(this.driver, '.ng-option');
        const companyList = await driverChrome.findElements(By.className('ng-option'));    
        
        await CreateProject.findDateInDropDown(companyList, company);
     
        const addressStreet = await driverChrome.findElement(By.id("projectAddress"));
        await addressStreet.sendKeys(street);

        const addressApart = await driverChrome.findElement(By.id("projectAddressSecond"));
        await addressApart.sendKeys(app)

        const stateDropDown = await driverChrome.findElement(By.id("projectSelectState"));
        await stateDropDown.click();
        const stateList  = await driverChrome.findElements(By.className("ng-option"));
      
        await CreateProject.findDateInDropDown(stateList, state);
       

        const cityDropDown = await driverChrome.findElement(By.id("projectSelectCity")) ;
        await cityDropDown.click();
        const cityList = await driverChrome.findElements(By.className("ng-option"));
        await CreateProject.findDateInDropDown(cityList, city);
       
        const projectZip = await driverChrome.findElement(By.id("projectZipCode"));
        await projectZip.sendKeys(zipcode);

        // const projectClientName = await driver.findElement(By.id("projectClientName"));
        // await projectClientName.sendKeys(client);

        // const projectStartData = await driver.findElement(By.id("projectStartDate"));
        // await projectStartData.sendKeys(startdate);

        // const projectEndtData = await driver.findElement(By.id('projectEndDate'));
        // await projectEndtData.sendKeys(enddate);
        await driverChrome.sleep(2000)
        const createBtn = await driverChrome.findElement(By.id('btnSubmit'));
       
        createBtn.click()
        
            name = "Test" + 1 +index
            number = "25"+index

        }
    });


    // it('remove project', async()=>{
    //     const logginPageTest = new LoginPage(driverChrome, URL);
    //     const removeProject = new RemoveProject(driverChrome);

    //     try {

    //         await logginPageTest.openLoginForm();
    //         await logginPageTest.fillEmailInput(email);
    //         await logginPageTest.fillPasswordInput(password);
    //         await logginPageTest.checkSaveForFuture();
    //         await logginPageTest.login(urlForCheck);
    
    //         await removeProject.goToProjectList();
    //         await removeProject.findProject(newProjectName, projectsPage);
    //         await removeProject.removefindProject(newProjectName)

    //     } catch (error) {
            
    //         await makeScreenshot(driverChrome, 'project_remove')
    //         throw error
    //     }
       
        
    // })

})