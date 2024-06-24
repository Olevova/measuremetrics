const { By, until } = require('selenium-webdriver');
const RemoveProject = require('./removeProject');

class EditProject extends RemoveProject {

  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async editProject (newProjectName){
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.wait(until.elementLocated(By.css('.settings-wrapper__btn-edit')),10000);
    const editBtn = await this.driver.findElement(By.css('.settings-wrapper__btn-edit'));
    await this.driver.wait(until.elementIsEnabled(editBtn),10000);
    await editBtn.click();
    await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"]')),10000);
    const nameInput = await this.driver.findElement(By.id('projectName'));
    await nameInput.click();
    await this.driver.sleep(1000);
    await nameInput.clear();
    await this.driver.sleep(1000);
    await nameInput.sendKeys(newProjectName);
    const submitBtn = await this.driver.findElement(By.id('btnSubmit'));
    await submitBtn.click();
    await this.notificationCheck('id','mainErrorText');
    console.log(`New Project name ${newProjectName}`);

  }

  async editProjectViaThreeDotsMenu(nameOld, newName){
    await this.driver.wait(until.elementsLocated(By.css('.table-projects__row .item-info-list')),10000);
    await this.findItemAndOpenThreeDotsMenu(nameOld,'.table-projects__row .item-info-list .company-name .list-name-wrapper');
    await this.driver.wait(until.elementLocated(By.css('#dotsMenu[editmenuopen]')),10000);
    const editBtn = await this.driver.findElement(By.css('#dotsMenu[editmenuopen] #editItem'))
    await this.driver.wait(until.elementIsVisible(editBtn), 10000);
    await this.driver.wait(until.elementIsEnabled(editBtn), 10000);
    await editBtn.click();
    await this.driver.sleep(2000);
    await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"]')),10000);
    const nameInput = await this.driver.findElement(By.id('projectName'));
    await nameInput.click();
    await nameInput.clear();
    await this.driver.sleep(1000);
    await nameInput.sendKeys(newName);
    const submitBtn = await this.driver.findElement(By.id('btnSubmit'));
    await submitBtn.click();
    await this.notificationCheck('id','mainErrorText');
    console.log(`New Project name ${newName}`);
  }

}

module.exports = EditProject;
