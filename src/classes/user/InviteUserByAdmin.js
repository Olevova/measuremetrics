const { Build, By, Select, until } = require('selenium-webdriver');
const Base = require('../base');

class InviteUserByAdmin extends Base {
  static async waitForSpecificTime(hour, minute) {
    const now = new Date();
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
  
    const timeDifference = targetTime - now;
    if (timeDifference > 0) {
      console.log(now);
      return new Promise(resolve => setTimeout(resolve, timeDifference));
    }
  }
  static async findDateInDropDown(array, text) {
    for (const option of array) {
      const dateUser = (await option.getText()).trim().toLowerCase();

      if (dateUser === text.trim().toLowerCase()) {
        await option.click();
        return;
      }
    }
    if (array.length > 0) {
      await array[0].click();
      return;
    }

    throw new Error(`Users list is empty`);
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.startUsersNumber = 0;
    this.endUsersNumber = 0;
  }


  async fillInviteForm(email, company, role) {
    await this.driver.wait(until.elementLocated(By.id('userEmail'),10000))
    const selectEmail = await this.driver.findElement(By.id('userEmail'));
    await this.driver.wait(until.elementIsVisible(selectEmail), 3000);
    await selectEmail.sendKeys(email);


    const sendAnInvite = this.driver.findElement(By.id('btnInvite'));
    // await InviteUserByAdmin.waitForSpecificTime(18, 27);
    await sendAnInvite.click();
        const errorCreate = await this.driver
      .findElements(until.elementLocated(By.id('mainError')), 1000)
      .catch(() => null);

    if (errorCreate) {
      console.log('Error element exists:', errorCreate);
      throw new Error('You have error, check screenshot');
    }

    await this.driver.wait(
        until.elementLocated(By.className('notification')),
        10000
      );
      const windowHandles = await this.driver.findElement(
        By.className('notification')
      );
  
      const windowHandlesText = await windowHandles.getText();
      console.log(windowHandlesText);
    
  }

}
module.exports = InviteUserByAdmin;
