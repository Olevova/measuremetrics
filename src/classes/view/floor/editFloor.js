const { By, until, Key } = require('selenium-webdriver');
const CreatFloor = require('./createFloor');

class EditFloor extends CreatFloor {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async editFloor(floor, newfloor) {
    await this.driver.wait(
      until.elementsLocated(By.css('.cdk-drag.floor-item')),
      10000
    );
    const floors = await this.driver.findElements(
      By.css('.cdk-drag.floor-item')
    );
    for (let item of floors) {
      if (item) {
        if ((await item.getText()) === floor) {
          await item.click();
          await this.driver.sleep(1000);
          const treeDots = await item.findElement(By.id('menuListFloorOpen'));
          await this.driver.wait(
            until.elementLocated(By.id('menuListFloorOpen')),
            10000
          );
          await this.driver.wait(until.elementIsEnabled(treeDots), 10000);
          await treeDots.click();

          await this.driver.wait(
            until.elementLocated(By.id('editFloorBtn')),
            10000
          );
          const editBtn = await this.driver.findElement(By.id('editFloorBtn'));
          await this.driver
            .wait(until.elementIsEnabled(editBtn), 10000)
            .click();
          await this.driver.wait(until.stalenessOf(editBtn), 10000);
          break;
        }
      } else {
        throw new Error('Floor is not created');
      }
    }

    await this.driver.wait(
      until.elementLocated(By.css('form.form-edit-floor[opened]'))
    );
    const form = await this.driver.findElement(
      By.css('form.form-edit-floor[opened]')
    );
    const inputFloor = await form.findElement(By.id('editFloorInput'));
    await this.driver.wait(until.elementIsEnabled(inputFloor), 10000);
    await inputFloor.clear();
    await this.driver.sleep(500);
    await inputFloor.sendKeys(newfloor);

    const saveBtn = await form.findElement(By.id('saveEditFloorBtn'));
    await this.driver.wait(until.elementIsEnabled(saveBtn), 10000);
    await saveBtn.click();
  }
}
module.exports = EditFloor;
