const { By, until } = require('selenium-webdriver');
const RemoveTask = require("../removeTask.js")


class RemoveTaskByEmployee extends RemoveTask {
  static async findTaskInList(array, taskName) {
    let taskSearchName = ' ';

    for (let i = 0; i < array.length; i += 1) {
      taskSearchName = await array[i].getText();

      if (taskSearchName === taskName) {
        const parentElement = await array[i].findElement(By.xpath('..'));
        const linkElement = await parentElement.findElement(
          By.css('.dots-actions')
        );
        await linkElement.click();
        return;
      }
    }

    throw new Error('No such task in the list of tasks');
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async goToTasksList(project) {
   
    await this.driver.wait(until.elementsLocated(By.id('linkProjectAdminOrEmployee')), 10000);
    const projectsBtn = await this.driver.findElement(By.id('linkProjectAdminOrEmployee'));
    await projectsBtn.click();

    await this.driver.wait(until.elementsLocated(By.css('.company-name')), 10000);
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

    await this.driver.executeScript('return document.readyState');

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
  }

}

module.exports = RemoveTaskByEmployee;
