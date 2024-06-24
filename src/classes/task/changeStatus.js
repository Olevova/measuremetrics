const { By, until, error } = require('selenium-webdriver');
const Base = require('../base');

class ChangeStatusTask extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.taskName = null;
    this.startTaskStatus = null;
    this.endTaskStatus = null;
  }

  async goToTasksList(project) {
    const projectsBtn = await this.driver.findElement(By.id('linkProjects'));
    await projectsBtn.click();
    await this.selectNumberOfItemsPerPagination();
    await this.driver.wait(until.elementsLocated(By.css('.company-name')), 10000);
    const firstProjectLink = await this.driver.findElements(By.css('.company-name'));
    if(project){
     await this.findAndClickOnLinkInTheList(project, ".company-name") 
    }
    else{
      await firstProjectLink[0].click();
    }
    
    await this.driver.wait(
      until.elementsLocated(By.className('tab-list__item')),
      10000
    );
    const tasksBtn = await this.driver.findElement(By.id('tasksTab'));
    await tasksBtn.click();
  }

  async findAllTasksInProject() {
    this.startEntiteNumber =  await this.numberOfItemsInTheList('.item-info-list')
  }

  async changeStatus (){
    const taskRow = await this.driver.findElement(By.className('table-tasks__row'));
    const firstTask = await taskRow.findElement(By.css('.task-name .task-name__wrapper .list-name-wrapper'))
    this.taskName= await firstTask.getText();
    
    const taskStatus = await taskRow.findElement(By.className('task-status-td'));
    await this.driver.executeScript('arguments[0].scrollIntoView(true);', taskStatus);
    // await this.driver
    //     .actions()
    //     .scroll(0, 0, 0, 0, taskStatus)
    //     .perform();
        
    await this.driver.sleep(2000);
    this.startTaskStatus = await taskStatus.getText();

    await taskStatus.click();
    await this.driver.wait(until.elementLocated(By.css('.task-status-td[openmenu]')),10000);
    const openStatusMenu = this.driver.findElement(By.css('.task-status-td[openmenu]'));
    const statusMenu = await openStatusMenu.findElement(By.className('task-status-menu'));
    // await this.driver.wait(until.elementIsVisible(statusMenu));
    const allStatus = await this.driver.findElements(By.className('task-status-menu__item'));

    for(const status of allStatus){
        if (this.startTaskStatus !== await status.getText()){
            
            this.endTaskStatus = await status.getText();
            await status.click();
            return

        }
    }
  }
  
  async checkStatus(){
    
    const changEl = await this.driver.findElement(By.className('table-tasks__row'));
    await this.driver.wait(until.elementTextIs(await changEl.findElement(By.className('task-status-td')), this.endTaskStatus),10000);
    console.log('change status succesful');

  
}}

module.exports = ChangeStatusTask;