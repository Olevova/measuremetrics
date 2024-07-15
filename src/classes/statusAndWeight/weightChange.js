const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class WeightChange extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.statusNow = '';
    this.selectStatusName = '';
  }
  //++++++++++++++++++++++++++++++++++++++++++++++++=
  async findeWeightAndChangeItMeasureMetrics(weight = 'medium') {
    let startTime;
    let endTime;
    let showWeightDropdown;
    let saveWeightTime;
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    const weightDropDown = await this.driver.findElement(By.css('.area__weight-btn'));
    startTime = performance.now();
    await weightDropDown.click();
    const weightList = await this.driver.findElements(
      By.css('.area__weight-menu__item')
    );
    await this.driver.wait(until.elementIsEnabled(weightList[0]),10000)
    endTime = performance.now();
    showWeightDropdown = endTime - startTime;
    startTime = performance.now();
    await this.findDateInDropDown(await weightList, weight);
    // await this.driver.wait(until.elementLocated(By.css('app-notification')),10000);
    // await this.driver.wait(until.elementLocated(By.css('.notification')),10000);
    await this.notificationCheck();
    endTime = performance.now();
    saveWeightTime = endTime - startTime;
    return {
      'dropdown show weight time': +showWeightDropdown.toFixed(2),
      'saved new areas weight time': +saveWeightTime.toFixed(2)
    }
    
  }
  //++++++++++++++++++++++++++++++++++++++++++++++++=

  async findeWeightAndChangeIt(weight = 'medium') {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    const weightDropDown = await this.driver.findElement(By.css('.area__weight-btn'));
    await weightDropDown.click();
    const weightList = await this.driver.findElements(
      By.css('.area__weight-menu__item')
    );
    await this.findDateInDropDown(await weightList, weight);
    await this.driver.wait(until.elementLocated(By.css('app-notification')),10000);
   
    
  }

  async closeAreaAndCheckProgress() {
    const closeAreaBtn = await this.driver.findElement(By.id('btnCloseModal'));
    await this.driver.wait(until.elementIsEnabled(closeAreaBtn));
    await closeAreaBtn.click();
    await this.driver.wait(
      until.elementLocated('backdrop[show="false"]'),
      10000
    );
  }
}

module.exports = WeightChange;
