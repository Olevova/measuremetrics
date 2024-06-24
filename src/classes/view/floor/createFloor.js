const { By, until } = require('selenium-webdriver');
const Base = require('../../base');

class CreatFloor extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async createFloor(floor) {
    await this.driver.wait(until.elementLocated(By.id('addFloor')), 10000);
    const addFloorBtn = await this.driver.findElement(By.id('addFloor'));
    await this.driver.wait(until.elementIsEnabled(addFloorBtn), 10000);
    await addFloorBtn.click();
    await this.driver.wait(
      until.elementLocated(By.id('createNewFloor')),
      10000
    );
    const creatNewFloorBtn = await this.driver.findElement(
      By.id('createNewFloor')
    );
    await creatNewFloorBtn.click();
    await this.driver.wait(
      until.elementLocated(By.id('createFloorInput')),
      10000
    );
    const floorInput = await this.driver.findElement(By.id('createFloorInput'));
    await floorInput.sendKeys(floor);
    const submitBtn = await this.driver.findElement(By.id('createFloorBtn'));
    // await this.driver.wait(until.elementIsEnabled(submitBtn),10000);
    await submitBtn.click();
  }

  async checkFloorCreation(floor) {
    await this.notificationCheck();
    await this.checkCreateItem('.cdk-drag.floor-item', floor);
  }
}

module.exports = CreatFloor;
