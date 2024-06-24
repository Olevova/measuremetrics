const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class SearchingTaskByName extends Base {
  static async numberOfElements(driver, locator) {
    await driver.wait(until.elementLocated(By.className(locator)), 10000);
    const totalEl = await driver.findElement(By.className(locator)).getText();
    const numberEl = totalEl.split(' ');
    const numberOfElements = Number(numberEl[numberEl.length - 1]);
    return numberOfElements;
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.startTaskNumber = 0;
    this.endTasksNumber = 0;
  }

  async goToTasksList(project) {
    const projectsBtn = await this.driver.findElement(By.id('linkProjects'));
    await projectsBtn.click();
    await this.selectNumberOfItemsPerPagination();

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
  }

  async searchingTasksByName(name) {
    const searchingFormInput = await this.driver.findElement(
      By.className('label-search')
    );
    await this.driver.wait(until.elementIsEnabled(searchingFormInput));
    this.startTaskNumber = await this.numberOfItemsInTheList('.item-info-list');
    await searchingFormInput.sendKeys(name);
  }

  async chekSearchingResult(name) {
    this.endTasksNumber = await this.numberOfItemsInTheList('.item-info-list')
    console.log(this.endTasksNumber);

    if (this.startTaskNumber === 1) {
      return;
    } else {
      let count = null;
      while (this.startTaskNumber === this.endTasksNumber && count < 5) {
        this.endTasksNumber = await this.numberOfItemsInTheList('.item-info-list');
        await this.driver.sleep(1000);
        count += 1;
      }
      if (count > 4) {
        throw new Error('searching not working');
      }
    }

    const allTasks = await this.driver.findElements(By.className('task-name'));

    for (const task of allTasks) {
      if ((await task.getText()) !== name) {
        console.log(await task.getText());

        throw new Error('search not work');
      }

      console.log('search is working');
    }
  }
}

module.exports = SearchingTaskByName;
