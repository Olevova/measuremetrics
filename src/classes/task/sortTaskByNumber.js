const { By, until, error } = require('selenium-webdriver');
const Base = require('../base');

class SortTaskByNumber extends Base {
  static async sortResult(driver, locator) {
    let numberElements = [];
    let firstEl = 1;
    let secondEl = 2;
    let waitSecond = 0;
    while (firstEl < secondEl && waitSecond < 10) {
      numberElements = await driver.findElements(By.className(locator));
      firstEl = parseInt(await numberElements[0].getText());
      secondEl = parseInt(await numberElements[1].getText());
      waitSecond += 1;
      console.log('work');
      await driver.sleep(1000);
    }

    if (firstEl < secondEl) {
      throw new Error('sorting not work');
    }
  }

  // static async numberOfTasks(driver) {
  //   await driver.executeScript('return document.readyState');
  //   await driver.wait(until.elementLocated(By.id('selectAmountItems')), 10000);
  //   const paginationDropDown = await driver.findElement(
  //     By.id('selectAmountItems')
  //   );

  //   if (!paginationDropDown) {
  //     emptyTaskList = 0;
  //     return emptyTaskList;
  //   }

  //   await driver.actions().scroll(0, 0, 0, 0, paginationDropDown).perform();

  //   const totalEl = await driver
  //     .findElement(By.className('total-item-text'))
  //     .getText();
  //   const numberEl = totalEl.split(' ');
  //   const numberOfTasks = Number(numberEl[numberEl.length - 1]);
  //   return numberOfTasks;
  // }

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.TaskNumber = 0;
  }

  async goToTasksLists(project) {
    const projectsBtn = await this.driver.findElement(By.id('linkProjects'));
    await projectsBtn.click();
    await this.driver.wait(until.elementsLocated(By.css('.company-name')),10000);
    const projectList =await this.driver.findElements(By.css('.company-name'));
    if(await projectList.length >= 20){
      console.log(await projectList.length);
      const pagination = await this.driver.wait(until.elementLocated(By.id('paginationWrapper')),3000);
      if(pagination){
      await this.selectNumberOfItemsPerPagination('100');
      }
      await this.driver.wait(until.elementsLocated(By.css('.company-name')),10000);
    }
    
    const firstProjectLink = await this.driver.findElements(By.css('.company-name'));
    if(project){
     await this.findAndClickOnLinInTheList(project, ".company-name") 
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

    this.TaskNumber = await this.numberOfItemsInTheList('.task-name__wrapper');

    if (this.TaskNumber < 2) {
      throw new Error('insufficient number of tasks for sorting');
    }
  }

  async sortTasks() {
    const sortingElements = await this.driver.findElements(
      By.className('table-sort-icon-btn')
    );
    await sortingElements[0].click();

    await this.driver.wait(
      until.elementsLocated(By.className('task-id')),
      10000
    );

    await SortTaskByNumber.sortResult(this.driver, 'task-id');
  }
}

module.exports = SortTaskByNumber;
