const { By, until } = require('selenium-webdriver');
const Base = require('../../base');
const path = require('path');

class CreateArea extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async addAreaInRoomWithoutCreatingTemplate(area){
    await this.driver.wait(
      until.elementLocated(By.css(".backdrop[show='true']")),
      10000
    );
    const roomModal = await this.driver.findElement(
      By.css(".backdrop[show='true']")
    );
    const firstAreaInput = await roomModal.findElement(
      By.css('.form-input-modal[placeholder="Area Name"]')
    );
    await this.driver.wait(until.elementIsEnabled(firstAreaInput), 10000);
    await firstAreaInput.sendKeys(area);
    await this.driver.sleep(1000);
    const saveAndUpdateBtnv = await roomModal.findElement(By.id('btnInvite'));
    await this.driver.wait(until.elementIsEnabled(saveAndUpdateBtnv), 10000);
    await saveAndUpdateBtnv.click();
  }

  async addAreaInRoom(area){
    await this.driver.wait(
      until.elementLocated(By.css(".backdrop[show='true']")),
      10000
    );
    const roomModal = await this.driver.findElement(
      By.css(".backdrop[show='true']")
    );
    await this.driver.wait(
      until.elementLocated(By.id('updateTemplate')),
      10000
    );
    const checkUpdateThisRoom = await roomModal.findElement(
      By.className('checkbox')
    );
    await this.driver.wait(until.elementIsEnabled(checkUpdateThisRoom, 10000));
    await checkUpdateThisRoom.click();
    const firstAreaInput = await roomModal.findElement(
      By.css('.form-input-modal[placeholder="Area Name"]')
    );
    await this.driver.wait(until.elementIsEnabled(firstAreaInput), 10000);
    await firstAreaInput.sendKeys(area);
    await this.driver.sleep(1000);
    const templateName = await roomModal.findElement(By.id('templateName'));
    await this.driver.wait(until.elementIsEnabled(templateName));
    await templateName.clear();
    await this.driver.sleep(500);
    await templateName.sendKeys(area);
    const saveAndUpdateBtnv = await roomModal.findElement(By.id('btnInvite'));
    await this.driver.wait(until.elementIsEnabled(saveAndUpdateBtnv), 10000);
    await saveAndUpdateBtnv.click();
  }

  async checkCreateArea(room, area) {
   await this.notificationCheck();
    const rooms = await this.driver.findElements(By.css('.rooms-list__item'));

    for (let item of rooms) {
      if (item) {
        if (
          (await item.findElement(By.className('room-name')).getText()) === room
        ) {
          const areaList = await item.findElement(
            By.css('.room-areas-list__item')
          );
          await this.driver.wait(until.elementIsVisible(areaList), 10000);
          if ((await areaList.getText()) === area) {
            console.log(`Area ${area} is created`);
            return;
          } else {
            throw new Error('Area is not created');
          }
        }
      }
    }
  }
}
module.exports = CreateArea;
