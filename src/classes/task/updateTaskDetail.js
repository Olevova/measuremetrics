const { By, until, error } = require('selenium-webdriver');
const Base = require('../base');

class UpdateTaskDetail extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async findAllTasksInProject() {
    await this.driver.wait(until.elementsLocated(By.css('.item-info-list')));
    const tasksNumber = this.driver.findElements(By.css('.item-info-list'));
    if(await tasksNumber.length >= 21){
      await this.driver.wait(
        until.elementLocated(By.id('selectAmountItems'), 10000)
      );
      const paginationDropDown = await this.driver.findElement(
        By.id('selectAmountItems')
      );
      await this.driver
        .actions()
        .scroll(0, 0, 0, 0, paginationDropDown)
        .perform();
  
        await paginationDropDown.click();
        const paginationList = await this.driver.findElements(
          By.className('ng-option')
        );
        await this.findDateInDropDown(paginationList, '100');
        await this.waitListDate('.task-name', 11);
    } 
    this.startEntiteNumber = await tasksNumber.length;
  }

  async editTask(taskName, newName) {
    await this.driver.wait(until.elementsLocated(By.css('.table-tasks__row .task-name')),10000);
    const listOfTasks = await this.driver.findElements(
      By.css('.table-tasks__row .task-name')
    );
    console.log('here and');
    // await this.driver.sleep(1000);
    for (const task of listOfTasks) {
      const taskNameForCheck = await task.getText();
      console.log(taskNameForCheck);
      if (taskName === taskNameForCheck) {
        await task.click();
        // await this.driver.sleep(1000);
        await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"] .modal')),10000)
        const taskForm = await this.driver.findElement(
          By.className('modalViewTask')
        );
        await this.driver.wait(until.elementIsEnabled(taskForm));

        const editBtn = await this.driver.findElement(By.id('btnEditTask'));
        await editBtn.click();
        await this.driver.wait(until.elementLocated(By.id('taskName')),10000);
        const taskNameInput = await this.driver.findElement(By.id('taskName'));
        await taskNameInput.clear();
        await taskNameInput.sendKeys(newName);
        await this.driver.sleep(2000);
        const saveBtn = await this.driver.findElement(By.id('btnSubmit'));
        await saveBtn.click();
        await this.driver.sleep(500);
        return
      }
    }
    await this.notificationCheck();
    await this.checkCreateItem('.task-name',newName)
    
  }

  async addAttachment(taskName){
    await this.findAndClickOnLinInTheList(taskName, '.task-name');
    await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"] .modal')),10000);
    const editBtn = await this.driver.findElement(By.id('btnEditTask'));
    await editBtn.click();
    await this.driver.wait(until.elementLocated(By.id('drop-area')),10000);

    const inputFile = await this.driver.findElement(By.id('fileInput'));
    
    //For local use
    // const inputFilePath = await this.fileReturn();
    // await inputFile.sendKeys(inputFilePath);
    //For local use

     // for Docker Use
     await inputFile.sendKeys("/external_jars/.classpath.txt") 
     // for Docker Use
    
    const saveBtn = await this.driver.findElement(By.id('btnSubmit'));
    await this.driver.wait(until.elementIsEnabled(saveBtn),10000);
    await saveBtn.click();
    await this.notificationCheck();
    await this.driver.sleep(2000);
  }

 async checkAttachment(taskName, filename){
  await this.findAndClickOnLinInTheList(taskName, '.task-name');
  await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"] .modal')),10000);
  await this.driver.wait(until.elementLocated(By.css('.task-files-list')),10000)
  const attacheFileList = await this.driver.findElement(By.css('.task-files-list'));
  await this.waitListDate('.file-link', 1 )
  const attacheFile = await attacheFileList.findElement(By.css('.file-link'));
  const fileSrc = await attacheFile.getAttribute('href');
  console.log(fileSrc, 'fileSrc');
  const fileNameArray = await fileSrc.split('/');
  const fileName = await fileNameArray[fileNameArray.length-1];
  if(filename.toLowerCase() !== fileName.toLowerCase()){
    throw new Error('file did not added');
  }
  else{
    console.log('file was added');
  }
  console.log(await fileName);

 }
}

module.exports = UpdateTaskDetail;
