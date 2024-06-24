const {createWebdriverChrom} = require('../webdriver');
const LoginPage = require('../../classes/auth/login');
const CreateRoom = require('../../classes/view/room/createRoom');
const DeleteRoom = require('../../classes/view/room/deleteRoom');
const CreateArea = require('../../classes/view/area/createArea');
const DeleteArea = require('../../classes/view/area/deleteArea');
const makeScreenshot = require('../makeScreenShot');
const { describe } = require("mocha");
const should = require("chai").should();
const { nanoid } = require('nanoid');


describe("create, edit and remove Room in the chrom browser", async () => {
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

    const newRoomName = 'tr'+ nanoid(5);
    const editFloorName = 'test2';
    const newAreaName = 'testArea';
  
    
    beforeEach(async()=>{

        driverChrome = await createWebdriverChrom()

    });

    afterEach(async()=>{

        if (driverChrome){
            await driverChrome.quit();
        }

    });

    it("create new Room", async ()=>{
        // time and site or lochalhost there tests are going
        console.log(Date().toLocaleLowerCase(), 'date', URL);

        const logginPageTest = new LoginPage(driverChrome, URL);
        const createRoom = new CreateRoom(driverChrome);
       
        await logginPageTest.openLoginForm();
        await logginPageTest.fillEmailInput(email);
        await logginPageTest.fillPasswordInput(password);
        await logginPageTest.checkSaveForFuture();
        await logginPageTest.login(urlForCheck);
        
        
       
        try {
            await createRoom.goToView();
            await createRoom.createRoom( '_', newRoomName);
            await createRoom.checkCreateNewRoom(newRoomName);
        
        } catch (error) {

            await makeScreenshot(driverChrome, 'room_create')
            throw error

        }
       
    });

    it("create new Area", async ()=>{
        // time and site or lochalhost there tests are going
        console.log(Date().toLocaleLowerCase(), 'date', URL);

        const logginPageTest = new LoginPage(driverChrome, URL);
        const createArea = new CreateArea(driverChrome);
       
        await logginPageTest.openLoginForm();
        await logginPageTest.fillEmailInput(email);
        await logginPageTest.fillPasswordInput(password);
        await logginPageTest.checkSaveForFuture();
        await logginPageTest.login(urlForCheck);
        
        
       
        try {
            await createArea.goToView();
            await createArea.openEditRoomFormViaThreeDots(newRoomName);
            await createArea.addAreaInRoom(newAreaName);
            await createArea.checkCreateArea(newRoomName,newAreaName);
            
        
        } catch (error) {

            await makeScreenshot(driverChrome, 'area_create')
            throw error

        }
       
    });

    it("delete new area", async ()=>{
        // time and site or lochalhost there tests are going
        console.log(Date().toLocaleLowerCase(), 'date', URL);

        const logginPageTest = new LoginPage(driverChrome, URL);
        const deleteArea = new DeleteArea(driverChrome);
       
        await logginPageTest.openLoginForm();
        await logginPageTest.fillEmailInput(email);
        await logginPageTest.fillPasswordInput(password);
        await logginPageTest.checkSaveForFuture();
        await logginPageTest.login(urlForCheck);
        
        
       
        try {
            await deleteArea.goToView();
            await deleteArea.openEditRoomFormViaThreeDots(newRoomName)
            await deleteArea.deleteArea(newAreaName);
            await deleteArea.checkDeleteArea(newRoomName,newAreaName)
            
        
        } catch (error) {

            await makeScreenshot(driverChrome, 'area_delete')
            throw error

        }
       
    });

    it("delete new room", async ()=>{
        // time and site or lochalhost there tests are going
        console.log(Date().toLocaleLowerCase(), 'date', URL);

        const logginPageTest = new LoginPage(driverChrome, URL);
        const deleteRoom = new DeleteRoom(driverChrome);
       
        await logginPageTest.openLoginForm();
        await logginPageTest.fillEmailInput(email);
        await logginPageTest.fillPasswordInput(password);
        await logginPageTest.checkSaveForFuture();
        await logginPageTest.login(urlForCheck);
        
        
       
        try {
            await deleteRoom.goToView();
            await deleteRoom.deleteRoom(newRoomName);
            await deleteRoom.checkDeleteFloor(newRoomName);
            
        
        } catch (error) {

            await makeScreenshot(driverChrome, 'room_delete')
            throw error

        }
       
    });

})