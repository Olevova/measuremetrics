const { By, until, ExpectedConditions } = require('selenium-webdriver');
const Base = require('../base');

class DeleteMulteTasks extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.startEntiteNumber = 0;
  }

  async findAllTasksInProject() {
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementsLocated(By.css('.task-name')),10000);
    const taskList = await this.driver.findElements(By.css('.task-name')) ;
    if ((await taskList.length) >= 21) {
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
   
    this.startEntiteNumber = await taskList.length;
  }

  async checkTasksInList(array) {
    const listOfTasks = await this.driver.findElements(
      By.className('task-name')
    );

    for (const [index, task] of listOfTasks.entries()) {
      if (array.includes(await task.getText())) {
        const threeDotsElement = await this.driver.findElements(By.css('.dots-actions'));
        const menuElement = await threeDotsElement[index];
        await this.driver.wait(until.elementIsEnabled(menuElement), 10000);
        await menuElement.click();
        await this.driver.wait(until.elementLocated(By.css('.dots-actions[editmenuopen]')),10000)
        const activeMenu = await this.driver.findElement(
          By.css('.dots-actions[editmenuopen]')
        );
        await this.driver.wait(until.elementIsEnabled(activeMenu), 10000);
        const menuEl = await activeMenu.findElement(By.id('selectItem'));
        await this.driver.wait(until.elementIsEnabled(menuEl, 10000));
        await menuEl.click();

        while ((await activeMenu.getAttribute('editmenuopen')) === true) {
          await this.driver.sleep(1000);
        }
      }
    }
  }

  async removeCheckingTasks() {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    const delCheckItemBtn = await this.driver.findElement(
      By.id('btnDeleteSelect')
    );
    await this.driver.actions().scroll(0, 0, 0, 0, delCheckItemBtn).perform();

    await delCheckItemBtn.click();
    const modalWindow = await this.driver.findElement(By.className('modal'));
    await this.driver.wait(until.elementIsVisible(modalWindow), 10000);

    const delBtn = this.driver.findElement(By.id('btnDeleteTask'));
    await this.driver.wait(until.elementIsEnabled(delBtn), 10000);
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await delBtn.click();

    await this.driver.wait(
      until.elementLocated(By.className('notification')),
      10000
    );
    const windowHandles = await this.driver.findElement(
      By.className('notification')
    );
    const windowHandlesText = await windowHandles.getText();

    const errorRegex = /error/i;
    if (errorRegex.test(windowHandlesText)) {
      throw new Error('You have error, check screenshot');
    } else console.log(windowHandlesText);

    let elAfterRemove = await this.numberOfItems(this.driver);
    let numderOfWaiting = null;
    while (this.startEntiteNumber === elAfterRemove && numderOfWaiting < 5) {
      elAfterRemove = await this.numberOfItems(this.driver);
      await this.driver.sleep(500);
      numderOfWaiting += 1;
      console.log(numderOfWaiting);
    }
    console.log(elAfterRemove, this.startEntiteNumber);
  }
}

module.exports = DeleteMulteTasks;
