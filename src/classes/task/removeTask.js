const { By, until } = require('selenium-webdriver');
const Base = require('../base.js');

class RemoveTask extends Base {
  static async findTaskInList(array, taskName) {
    let taskSearchName = ' ';

    for (let i = 0; i < array.length; i += 1) {
      taskSearchName = await array[i].getText();

      if (taskSearchName === taskName) {
        // const parentElement = await array[i].findElement(By.xpath('..'));
        // const linkElement = await parentElement.findElement(
        //   By.css('.dots-actions')
        // );
        const allDotsElement = await this.driver.findElements(By.css('.dots-actions'));
        const linkElement = await allDotsElement[i];
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

    await this.driver.executeScript('return document.readyState');
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
  }

  async taskRemove(task) {
    await this.driver.wait(
      until.elementsLocated(By.className('task-name')),
      10000
    );
    const allTasks = await this.driver.findElements(By.className('task-name'));

    if (allTasks) {
      // await RemoveTask.findTaskInList(allTasks, task);
      await this.findItemAndOpenThreeDotsMenu(task,'.task-name');
    }

    await this.driver.wait(until.elementLocated(By.css('#dotsMenu[editmenuopen]')),10000);
    const delBtn = await this.driver.findElement(By.css('#dotsMenu[editmenuopen] #deleteItem'))
    // await this.driver.wait(until.elementIsVisible(delBtn), 10000);
    await this.driver.sleep(2000)
    await this.driver.wait(until.elementIsEnabled(delBtn), 10000);
    await delBtn.click();

    await this.driver.wait(until.elementLocated(By.css('.modal')),10000);
    const delTaskBtn = await this.driver.findElement(By.id('btnDeleteTask'));
    await this.driver.wait(until.elementIsVisible(delTaskBtn), 10000);
    await this.driver.wait(until.elementIsEnabled(delTaskBtn), 10000);
    await this.driver.sleep(500)
   
    await delTaskBtn.click();

    await this.driver.wait(
      until.elementLocated(By.className('notification')),
      10000
    );
    const windowHandles = await this.driver.findElement(
      By.className('notification')
    );
    const windowHandlesText = await windowHandles.getText();

    if (windowHandlesText === 'Error. Failed to save data') {
      throw new Error('You have error, check screenshot');
    }
    try {
     const noTasks =  await this.driver.wait(
        until.elementsLocated(By.className('task-name')),
        10000
      ).catch(()=>null);

      if(noTasks === null ){
        console.log("list of task is empty");
        return 
      }
      const allTasksAfterDel = await this.driver.findElements(
        By.className('task-name')
      );

      const isTaskRemoved = allTasksAfterDel.every(
        async i => (await i.getText()) !== task
      );

      if (isTaskRemoved) {
        console.log('task is removed');
        return;
      } else {
        throw new Error('Task did not remove');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = RemoveTask;
