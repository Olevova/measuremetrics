const { By, until } = require('selenium-webdriver');
const logging = require('selenium-webdriver/lib/logging');
const Base = require('../base');

class RemoveProject extends Base {
  static async findProjectInList(array, projectName) {
    let projectSearchName = '';
    for(let i = 0; i < array.length; i += 1){
      console.log(await array[i].getText(), 'in');
    }
    console.log('I am in project');
    for (let i = 0; i < array.length; i += 1) {
      projectSearchName = await array[i].getText();
      console.log(projectSearchName, 'projectSearchName', projectName, projectSearchName === projectName);
      if (projectSearchName === projectName) {
        // const parentElement = await array[i].findElement(By.xpath('..'));
        // const linkElement = await parentElement.findElement(
        //   By.css('a.view-link')
        // );
        console.log('I am click here');
        await array[i].click();
        return;
      }
    }

    throw new Error('No such project in the list of project');
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
  }
  //The methods can use for logs devTools
  async enableBrowserConsoleLogs() {
    await this.driver.manage().logs().get(logging.Type.BROWSER);
  }

  async getAndProcessBrowserConsoleLogs() {
    const logs = await this.driver.manage().logs().get(logging.Type.BROWSER);
    logs.forEach(entry => {
      console.log(`[${entry.level.value}] ${entry.message}`);
    });
  }

  async goToProjectList(user="sa") {
    if(user === 'sa'){
      const projectBtnSa = await this.driver.findElement(By.id('linkProjects'));
      await projectBtnSa.click();
    }
    // else{
    //   const projectBtn = await this.driver.findElement(By.id('linkProjectsAdminOrEmployee'));
    //   await projectBtn.click();
    // }

    await this.driver.executeScript('return document.readyState');
    const numberOfProject = this.numberOfItemsInTheList('.item-info-list');
    if(numberOfProject >= 20){
      await this.driver.wait(
        until.elementLocated(By.id('selectAmountItems')),
        10000
      );
  
      const paginationDropDown = await this.driver.findElement(
        By.id('selectAmountItems')
      );
      await paginationDropDown.click();
      const paginationList = await this.driver.findElements(
        By.className('ng-option')
      );
      await this.findDateInDropDown(paginationList, '100');
      await this.waitListDate('.company-name', 11);

    }

  }

  async findProject(project, page) {
    await this.driver.wait(until.urlIs(page), 10000);
    await this.driver.wait(
      until.elementsLocated(By.className('project-name__wrapper')),
      10000
    );
    const allProjects = await this.driver.findElements(
      By.className('project-name__wrapper')
    );
    if (allProjects) {
      await this.driver.sleep(2000);
      await this.waitListDate('.project-name__wrapper', 3);
      const projectList = await this.driver.findElements(
        By.className('project-name__wrapper')
      );
      await RemoveProject.findProjectInList(projectList, project);
      await this.driver.wait(until.elementLocated(By.id('settingsTab')),10000)
      await this.driver.findElement(By.id('settingsTab')).click()
      console.log('click on project');
      await this.driver.sleep(1000);
    }
  }

  async removefindProject(projectName) {
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    console.log('project inside');
    await this.driver.wait(
      until.elementLocated(By.id('btnDeleteProjectOpenModal'), 10000)
    );
    
    const delBtnProject = await this.driver.findElements(
      By.id('btnDeleteProjectOpenModal')
    );
    await delBtnProject[0].click();

    const modal = this.driver.findElement(By.className('modal'));
    await this.driver.wait(until.elementIsEnabled(modal), 10000);

    const delBtnModalProject = await this.driver.findElement(
      By.id('btnDeleteProject')
    );
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);

    await this.driver.wait(until.elementIsEnabled(delBtnModalProject), 10000);
    
    await delBtnModalProject.click();

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
      await this.driver.wait(
        until.elementsLocated(By.className('company-name')),
        3000
      );
      const allProjectsAfterDel = await this.driver.findElements(
        By.className('company-name')
      );

      const isCompanyRemoved = allProjectsAfterDel.every(
        async (i) =>{(await i.getText()) !== projectName}
      );
      console.log(isCompanyRemoved);

      if (isCompanyRemoved) {
        return;
      } else {
        throw new Error('Company did not remove');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async removeProjectViaThreeDotsMenu(nameOfProject){
    await this.driver.wait(until.elementsLocated(By.css('.table-projects__row .item-info-list')),10000);
    await this.findItemAndOpenThreeDotsMenu(nameOfProject,'.table-projects__row .item-info-list .company-name .list-name-wrapper');
    await this.driver.wait(until.elementLocated(By.css('#dotsMenu[editmenuopen]')),10000);
    const deleteBtn = await this.driver.findElement(By.css('#dotsMenu[editmenuopen] #deleteItem'))
    await this.driver.wait(until.elementIsVisible(deleteBtn), 10000);
    await this.driver.wait(until.elementIsEnabled(deleteBtn), 10000);
    await deleteBtn.click();
    await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"]')),10000);
    await this.driver.wait(until.elementLocated(By.css('.modal')),10000);
    const modal = this.driver.findElement(By.className('modal'));
    await this.driver.wait(until.elementIsEnabled(modal), 10000);
    const delBtnModalProject = await this.driver.findElement(
      By.id('btnDeleteProject')
    );
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    // await this.driver.sleep(1000);
    await this.driver.wait(until.elementIsEnabled(delBtnModalProject), 10000);
    
    await delBtnModalProject.click();
    await this.notificationCheck();
    await this.checkDeleteItem('.company-name', nameOfProject);
  }
}

module.exports = RemoveProject;
