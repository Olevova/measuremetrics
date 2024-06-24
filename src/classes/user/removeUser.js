const { By, until } = require('selenium-webdriver');
const InviteUser = require('./inviteUser');

class RemoveUser extends InviteUser {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async goToUserList(user='sa') {
    if(user==='sa'){
      const companyBtn = await this.driver.findElement(By.id('linkUsers'));
      await companyBtn.click();
    }
    else{
      await this.driver.sleep(1000);
      const companyBtn = await this.driver.findElement(By.id('linkUsersInProject'));
      await companyBtn.click();
    }

    await this.driver.executeScript('return document.readyState');
    
    const numberOFUser = await this.numberOfItemsInTheList('.table-users__row');
    if (numberOFUser >= 21){
      
    await this.driver.wait(
      until.elementLocated(By.id('selectAmountItems')),
      10000
    );

    const paginationDropDown = await this.driver.findElement(
      By.id('selectAmountItems')
    );
    await this.driver
      .actions()
      .scroll(0, 0, 0, 0, paginationDropDown)
      .perform();

    const totalEl = await this.driver
      .findElement(By.className('total-item-text'))
      .getText();
    const numberEl = totalEl.split(' ');
    const numberOfCompanies = Number(numberEl[numberEl.length - 1]);

    if (numberOfCompanies > 10) {
      await paginationDropDown.click();
      const paginationList = await this.driver.findElements(
        By.className('ng-option')
      );
      await this.findDateInDropDown(paginationList, '100');
      await this.waitListDate('.company-name', 11);
    }
  }
  }

  async findUser(user, usersPage) {
    await this.driver.wait(until.urlIs(usersPage), 10000);
    let userForSearch = '';

    await this.driver.wait(
      until.elementsLocated(By.css('.user-email')),
      10000
    );
    const allUsers = await this.driver.findElements(By.css('.user-email'));

    if (allUsers) {
      for (let i = 0; i < allUsers.length; i += 1) {
        userForSearch = await allUsers[i].getText();

        if (userForSearch === user) {
          const allThreeDotsMenu = await this.driver.findElements(By.css('.dots-actions'));
          const userMenu = await allThreeDotsMenu[i]
          await userMenu.click();
          return;
        }
      }

      throw new Error('No such user');
    }
  }

  async removefindUser() {
    const userDotMenu = await this.driver.findElement(By.css('#dotsMenu[editmenuopen]'));
    const removeBtn = await userDotMenu.findElement(
      By.id('deleteItem')
    );
    await this.driver.wait(until.elementIsVisible(removeBtn), 10000);
    await this.driver.executeScript('return document.readyState');

    await removeBtn.click();
    const modal = this.driver.findElement(By.className('backdrop manual'));
    await this.driver.wait(until.elementIsEnabled(modal), 10000);

    const delUserBtn = await this.driver.findElement(By.id('btnDeleteProject'));

    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);

    await delUserBtn.click();
    
  }

  async checkIfUserRemove(delemail, userPage) {
    await this.driver.wait(until.elementLocated(By.className('notification')));
    const windowHandles = await this.driver.findElement(
      By.className('notification')
    );

    const windowHandlesText = await windowHandles.getText();
    console.log(windowHandlesText);

    if (windowHandlesText === 'Such user already exists') {
      throw new Error('You have error, check screenshot');
    }
    try {
      await this.driver.wait(until.urlIs(userPage), 10000);
      await this.checkDeleteItem('.user-email', delemail);
      return;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = RemoveUser;
