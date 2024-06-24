const { By, until } = require('selenium-webdriver');

class LoginPage {
  constructor(driver, url) {
    this.driver = driver;
    this.url = url;
  }

  async openLoginForm() {
    await this.driver.get(this.url);
    await this.driver.wait(until.elementsLocated(By.css('form')), 10000);
  }

  async fillEmailInput(email) {
    if (!email) {
      throw new Error('no email');
    }

    await this.driver.wait(until.elementsLocated(By.id('email')), 10000);
    const emailInput = await this.driver.findElement(By.id('email'));
    await emailInput.sendKeys(email);
  }

  async fillPasswordInput(password) {
    if (!password) {
      throw new Error('no password');
    }

    await this.driver.wait(until.elementsLocated(By.id('password')), 10000);
    const passwordInput = await this.driver.findElement(By.id('password'));
    await passwordInput.sendKeys(password);
  }

  async checkSaveForFuture() {
    const checkForFutureSave = await this.driver.findElement(
      By.className('checkbox')
    );
    await checkForFutureSave.click();
  }

  async login(urlForCheck) {
    const enterButton = this.driver.findElement(By.id('btn-submit'));
    const isEnabled = await enterButton.isEnabled();

    if (isEnabled) {
      await enterButton.click();
      await this.driver.wait(until.urlIs(urlForCheck), 10000);
    } else {
      const errorElement = await this.driver.findElement(
        By.className('error-message')
      );
      await this.driver.wait(
        until.elementsLocated(By.className('error-message')),
        3000
      );
      throw new Error(await errorElement.getText());
    }
  }

  async loginWithoutCheckingURL() {
    const enterButton = this.driver.findElement(By.id('btn-submit'));
    const isEnabled = await enterButton.isEnabled();

    if (isEnabled) {
      await enterButton.click();
      await this.driver.wait(until.urlMatches(/^https:\/\/dev-frontend\.colorjob\.terenbro\.com\/system/), 10000);
    } else {
      const errorElement = await this.driver.findElement(
        By.className('error-message')
      );
      await this.driver.wait(
        until.elementsLocated(By.className('error-message')),
        3000
      );
      throw new Error(await errorElement.getText());
    }
  }
}

module.exports = LoginPage;
