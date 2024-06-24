const { Build, By, Select, until } = require('selenium-webdriver');
const InviteUser = require('./inviteUser');

class AddRemoveUserToProject extends InviteUser {
  

  constructor(driver) {
    super(driver);
    this.driver = driver;
   
  }

  async addExistingUser(user) {
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementsLocated(By.id('btnAddUsersToProject')),10000);
    const addExistingUserBtn = await this.driver.findElement(By.id('btnAddUsersToProject'));
    await this.driver.wait(until.elementIsEnabled(addExistingUserBtn),10000);
    await addExistingUserBtn.click();
    await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"]')),10000);
    const inviteForm = await this.driver.findElement(By.css('.form-invite'));
    const usersDropDown = await inviteForm.findElement(By.id('selectUsers'));
    await usersDropDown.click();
    await this.waitListDate('.ng-option', 2);
    const usersList = await this.driver.findElements(By.css('.ng-option'));
    await this.findDateInDropDown(usersList, user);
    const addToProjectBtn = await this.driver.findElement(By.id('btnAddUsers'));
    await this.driver.wait(until.elementIsEnabled(addToProjectBtn));
    await addToProjectBtn.click();
    await this.notificationCheck();
    
}


async removeUserFromProject(user){
    await this.waitListDate('.list-name-wrapper.user-name-wrapper', 1)
    await this.findItemAndOpenThreeDotsMenu(user, '.list-name-wrapper.user-name-wrapper');
    await this.driver.wait(until.elementLocated(By.css('#dotsMenu[editmenuopen]')),1000) ;
    const removeBtn = await this.driver.findElement(By.id('deleteItem'));
    await this.driver.wait(until.elementIsEnabled(removeBtn),10000);
    await removeBtn.click();
    await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"]')),10000);
    const removeUserBtn = await this.driver.findElement(By.id('btnDeleteProject'));
    await this.driver.wait(until.elementIsEnabled(removeUserBtn),10000);
    await removeUserBtn.click();
    await this.notificationCheck();
}
}
module.exports = AddRemoveUserToProject;
