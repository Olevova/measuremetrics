const { By, until } = require('selenium-webdriver');
const CreatFloor = require('./createFloor');

class DeleteFloor extends CreatFloor {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async deleteFloor(floor) {
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
          break;
        }
      } else {
        throw new Error('Floor is not created');
      }
    }

    await this.driver.wait(
      until.elementLocated(By.id('deleteFloorBtn')),
      10000
    );
    const delBtn = await this.driver.findElement(By.id('deleteFloorBtn'));
    await this.driver.wait(until.elementIsEnabled(delBtn), 10000).click();
    await this.driver.wait(
      until.elementLocated(By.id('btnDeleteProject')),
      10000
    );
    const confirmDeleteBtn = await this.driver.findElement(
      By.id('btnDeleteProject')
    );
    await this.driver.sleep(1000);
    await confirmDeleteBtn.click();
  }

  async checkDeleteFloor(floor) {
    await this.notificationCheck();
    await this.checkDeleteItem('.cdk-drag.floor-item', floor);
  }
}

module.exports = DeleteFloor;
