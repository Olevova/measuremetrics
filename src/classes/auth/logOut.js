const { By, until } = require('selenium-webdriver');

class LogOut {
  constructor(driver) {
    this.driver = driver;
  }

  async findUserMenu() {
    await this.driver.executeScript('return document.readyState');
    const profileMenu = this.driver.findElement(By.id('profileUserBtn'));
    await this.driver.wait(until.elementIsVisible(profileMenu), 10000);
    await profileMenu.click();
  }

  async userLogOut(urlLogin) {
    await this.driver.wait(until.elementLocated(By.id('btnLogout')), 10000);
    const logOutBtn = this.driver.findElement(By.id('btnLogout'));
    await this.driver.wait(until.elementIsVisible(logOutBtn), 10000);
    await logOutBtn.click();
    await this.driver.wait(until.urlIs(urlLogin), 10000);
  }
}

module.exports = LogOut;
