const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class CreateCustomStatus extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async creatCustomStatus(name, color = 1) {
    await this.goToCustomStatusCreateForm();
    await this.driver.wait(
      until.elementLocated(
        By.css('.backdrop[show="true"] .form-invite.form-create')
      ),
      10000
    );
    const addStatusBtn = await this.driver.findElement(By.id('addAreaField'));
    await this.driver.wait(until.elementIsEnabled(addStatusBtn), 10000);
    await this.driver.sleep(1000);
    await addStatusBtn.click();
    await this.driver.wait(
      until.elementLocated(By.css('ul.additional-statuses-list')),
      10000
    );
    const newStatusList = await this.driver.findElement(
      By.css('ul.additional-statuses-list')
    );
    const statusInput = await newStatusList.findElement(
      By.css(".form-input-modal[placeholder='Status Name']")
    );
    await statusInput.sendKeys(name);
    await newStatusList
      .findElement(By.css('.color-box-with-list-wrapper'))
      .click();
    await this.driver.wait(until.elementLocated(By.css('.colors-list')), 10000);
    const colorList = await this.driver.findElement(
      By.css('.colors-list'),
      10000
    );
    await this.driver.wait(until.elementIsEnabled(colorList));
    const customColors = await colorList.findElements(
      By.css('.colors-list__item')
    );
    await customColors[color].click();
    await this.driver.sleep(1000);
    const submitBtn = await this.driver.findElement(By.id('btnSubmit'));
    await submitBtn.click();
  }

  async checkCreateStatus(name) {
    await this.notificationCheck();
    await this.checkCreateItem('.view-area-status__item', name + ' (0%)');
    await this.driver.sleep(1000);
  }
}

module.exports = CreateCustomStatus;
