const { By, until } = require('selenium-webdriver');
const CreateArea = require('./createArea');

class DeleteArea extends CreateArea{

    constructor(driver){
        super(driver);
        this.driver = driver;
    }

async deleteArea(area){
    await this.driver.wait(
        until.elementLocated(By.css(".backdrop[show='true']")),
        10000
      );
      const roomModal = await this.driver.findElement(
        By.css(".backdrop[show='true']")
      );
      await this.driver.wait(until.elementLocated(By.className('detach-btn')),10000);
      const detachBtn = await roomModal.findElement(By.className('detach-btn'));
      await this.driver.wait(until.elementIsEnabled(detachBtn, 10000));
      await this.driver.sleep(2000);
      await detachBtn.click();
      await this.driver.sleep(2000);
      await this.driver.wait(until.elementLocated(By.css('.cdk-drag.area-form-row')),10000)
      const areaInput = this.driver.findElement(By.css('.cdk-drag.area-form-row'));
      const areaName = await areaInput.findElement(By.css('.form-input-modal[placeholder="Area Name"]'));
      console.log(await areaName.getAttribute('value'), 'area');
      if (await areaName.getAttribute('value') === area){
        const delBtn = await areaInput.findElement(By.id('deleteAreaField'));
        await this.driver.wait(until.elementIsEnabled(delBtn),10000);
        await delBtn.click();
        const saveAndUpdateBtnv = await roomModal.findElement(By.id('btnInvite'));
        await this.driver.wait(until.elementIsEnabled(saveAndUpdateBtnv), 10000);
        await saveAndUpdateBtnv.click();

    }
    else {
        throw new Error('Not such area')
    }
}

async checkDeleteArea(roomName, area){
    await this.notificationCheck();
    await this.driver.wait(until.elementsLocated(By.css('.rooms-list__item')), 10000);
    const rooms = await this.driver.findElements(By.css('.rooms-list__item'));

    for (let item of rooms) {
      if (item) {
        if (
          (await item.findElement(By.className('room-name')).getText()) === roomName
        ) {
          const areaList = await item.findElement(
            By.css('.room-areas-list__item')
          );
          await this.driver.wait(until.elementIsVisible(areaList), 10000);
          if ((await areaList.getText()) === area) {
            throw new Error('Area is not delete');
           
          } else {
            console.log(`Area ${area} is delete`);
            return;
          }
        }
      }
    }


}

}

module.exports = DeleteArea;