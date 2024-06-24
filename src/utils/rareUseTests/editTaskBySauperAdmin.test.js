const {createWebdriverChrom} = require('../webdriver');
const LoginPage = require('../../classes/auth/login');
const CreateTask = require("../../classes/task/createTask");
const SearchingTaskByName = require('../../classes/task/searchingTask');
const RemoveTask = require("../../classes/task/removeTask");
const UpdateTaskDetail = require("../../classes/task/updateTaskDetail");
const makeScreenshot = require('../makeScreenShot');
const { describe } = require("mocha");
const should = require("chai").should();


describe("create, searching by name, edit and remove task in the chrom browser", async () => {
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

    const newTaskName = 'TestTime';
    const newTaskNameForUpdate = "SameTimeTaskAdmin2"
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



    it('update task', async () =>{
        const logginPageTest = new LoginPage(driverChrome, URL);
        const updateTaskDetail = new UpdateTaskDetail(driverChrome);
        const goToTasks = new SearchingTaskByName(driverChrome); 

        await logginPageTest.openLoginForm();
        await logginPageTest.fillEmailInput(email);
        await logginPageTest.fillPasswordInput(password);
        await logginPageTest.checkSaveForFuture();
        await logginPageTest.login(urlForCheck);
        await goToTasks.goToTasksList();
        
        try {
            await updateTaskDetail.findAllTasksInProject()
            await updateTaskDetail.editTask(newTaskName, newTaskNameForUpdate) 
          
        } catch (error) {
            
            await makeScreenshot(driverChrome, 'task_update');
            throw error
        }


    })


})