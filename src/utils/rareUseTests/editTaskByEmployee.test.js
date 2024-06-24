const {createWebdriverChrom} = require('../webdriver');
const LoginPage = require('../../classes/auth/login');
const CreateTaskByEmployee = require("../../classes/task/employee/employeeCreateTask");
const EmployeeUpdateTask = require("../../classes/task/employee/employeeUpdateTask")
const makeScreenshot = require('../makeScreenShot');
const { describe } = require("mocha");
const should = require("chai").should();


describe("create, edit and remove task by the employee in the chrom browser", async () => {
    // here add parameters for creation 
    let driverChrome = null;

    // const URL = 'http://frontend-cj:4200/login'; 
    // const urlForCheck = "http://frontend-cj:4200/system/dashboard";
    // const companiesPage = 'http://frontend-cj:4200/system/companies/1';

    // const URL = 'http://localhost:4200/login'; 
    // const urlForCheck = "http://localhost:4200/system/company/1";
    // const companiesPage = 'http://localhost:4200/system/company/1';

    const companiesPage = 'https://dev-frontend.colorjob.terenbro.com/system/companies';
    const URL = 'https://dev-frontend.colorjob.terenbro.com/login';
    const urlForCheck = "https://dev-frontend.colorjob.terenbro.com/system/company/2"
    const email = "olevova@ukr.net";
    const password ="111111" ;

    const newTaskName = 'TestTime';
    const newTaskNameForUpdate = "SameTimeTaskEmployee2"
    const newTaskDescription = "Test description";
    const newTaskDueData= '15.12.2024';
    
    beforeEach( async () => {

        driverChrome = await createWebdriverChrom()

    });

    afterEach( async () => {

        if (driverChrome){

            await driverChrome.quit();
        }

    });



    it('update task by employee', async () =>{
             // time and site or lochalhost there tests are going
        console.log(Date().toLocaleLowerCase(), 'date', URL);

        const logginPageTest = new LoginPage(driverChrome, URL);
        const employeeUpdateTask = new EmployeeUpdateTask(driverChrome);
       
        await logginPageTest.openLoginForm();
        await logginPageTest.fillEmailInput(email);
        await logginPageTest.fillPasswordInput(password);
        await logginPageTest.checkSaveForFuture();
        await logginPageTest.login(urlForCheck);
       
        try {

            await employeeUpdateTask.goToCreateTasksForm();
            await employeeUpdateTask.editTask(newTaskName, newTaskNameForUpdate);

        } catch (error) {

            await makeScreenshot(driverChrome, 'task_update')
            throw error

        }

    })


})