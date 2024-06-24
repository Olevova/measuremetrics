const { By, until } = require('selenium-webdriver');
const CreatTask = require('../createTask');

class CreateTaskByEmployee extends CreatTask {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async goToCreateTasksForm() {
    await this.driver.wait(until.elementsLocated(By.id('linkProjectAdminOrEmployee')), 10000);
    const firstLink = await this.driver.findElements(By.id('linkProjectAdminOrEmployee'));
    console.log('element');
    await this.driver.sleep(1000);
    for(let i of firstLink){
      console.log(await i.getText());
    }
    await firstLink[0].click();

    await this.driver.wait(
      until.elementsLocated(By.className('tab-list__item')),
      10000
    );
    const tasksBtn = await this.driver.findElement(By.id('tasksTab'));
    await tasksBtn.click();
  }

  async fillCreateTask(name, description, taskDueData, user) {
    await this.driver.wait(until.elementLocated(By.id('btnCreate')),5000);
    console.log('find');
    const createTaskBtn = await this.driver.findElement(By.id('btnCreate'));
    await this.driver.wait(until.elementIsEnabled(createTaskBtn), 10000);

    this.startTaskNumber = await this.numberOfItems(this.driver);

    await createTaskBtn.click();

    const createForm = this.driver.findElement(By.className('modal'));
    await this.driver.wait(until.elementIsEnabled(createForm), 10000);

    const taskName = await this.driver.findElement(By.id('taskName'));
    await taskName.sendKeys(name);

    const nameDropdown = await this.driver.findElement(By.id('taskSelectMember'));
    await nameDropdown.click();
    const nameList = await this.driver.findElements(By.className('ng-option'));
    if(user){
      await this.findDateInDropDown(nameList, user);
    }
    else{
      
      await nameList[0].click();
    }
    
    const taskDescription = await this.driver.findElement(
      By.id('taskDescription')
    );
    await taskDescription.sendKeys(description);

    const taskPriority = await this.driver.findElement(By.id('prioritySelect'));
    await taskPriority.click();

    await this.waitListDate('.ng-option', 2);

    const priorietyList = await this.driver.findElements(
      By.className('ng-option')
    );

    await this.findDateInDropDown(priorietyList, 'Low');

    const taskData = await this.driver.findElement(By.id('taskDueDate'));
    await taskData.sendKeys(taskDueData);

    const submitBtn = await this.driver.findElement(By.id('btnSubmit'));
    await submitBtn.click();
    await this.notificationCheck();

    await this.driver.sleep(1000);
  }

  async getTaskId(taskName){
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    const allTasks = await this.driver.findElements(By.css('.table-tasks__row'));
    for (let task of allTasks){
      const taskTitle = await task.findElement(By.css('.task-name .list-name-wrapper')).getText();
      if(await taskTitle.trim()===taskName){
        const taskId = await task.findElement(By.css('.task-id .list-name-wrapper')).getText();
        return taskId.trim();
      }
    }
    console.log("Not such task in tasks list");
  }
}

module.exports = CreateTaskByEmployee;
