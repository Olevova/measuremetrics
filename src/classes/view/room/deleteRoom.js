const { By, until } = require('selenium-webdriver');
const Base = require('../../base');

class DeleteRoom extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async deleteRoom(room) {
    await this.driver.wait(until.elementsLocated(By.css('.room-name')), 10000);
    const rooms = await this.driver.findElements(By.css('.room-name'));
    for (let item of rooms) {
      if (item) {
        const roomForDelete = item.getText()
        // console.log(await item.getText());
        if ((await roomForDelete.trim()) === room) {
          await this.driver.wait(
            until.elementLocated(By.css('.menu-list-dots-wrapper')),
            10000
          );
          const menuBtn = await item.findElement(
            By.css('.menu-list-dots-wrapper')
          );
          await this.driver.wait(until.elementIsEnabled(menuBtn), 10000);
          await menuBtn.click();
          break;
        }
      } else {
        throw new Error('Room is not created');
      }
    }

    await this.driver.wait(
      until.elementLocated(By.css('.editMenuList[editmenuroomopen]')),
      10000
    );
    const roomMenu = await this.driver.findElement(
      By.css('.editMenuList[editmenuroomopen]')
    );
    const deleteRoomBtn = await roomMenu.findElement(By.id('deleteRoomBtn'));
    await this.driver.wait(until.elementIsEnabled(deleteRoomBtn), 10000);
    await deleteRoomBtn.click();
  }

  async checkDeleteFloor(room) {
    await this.notificationCheck();
    await this.checkDeleteItem('.room-arrow-with-name-wrapper', room);
  }
}

module.exports = DeleteRoom;
