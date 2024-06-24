const { By, until } = require('selenium-webdriver');
const CreateUnit = require('./createUnit');

class EditUnit extends CreateUnit {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async editUnit(unit, newUnit) {
    await this.driver.wait(
      until.elementsLocated(By.css('.unit-name-with-btn-wrapper'))
    );
    const units = await this.driver.findElements(
      By.css('.unit-name-with-btn-wrapper')
    );
    for (let item of units) {
      let noBtn = false;
      if (item) {
        const unitName = await item.findElement(By.css('.unit-name-wrapper p'));
        if ((await unitName.getText()) === unit) {
          const menuBtn = await item.findElement(By.id('menuListAddRoomOpen'));
          await this.driver.wait(until.elementIsEnabled(menuBtn));
          noBtn = true;
          await menuBtn.click();
          const menu = await this.driver.findElement(
            By.css('.editMenuList[editmenuunitopen]')
          );

          const editUnitBtn = await menu.findElement(By.id('editUnitBtn'));
          await this.driver.wait(until.elementIsEnabled(editUnitBtn), 10000);
          await editUnitBtn.click();
          break;
        }
      }
    }
    await this.driver.wait(
      until.elementLocated(
        By.css('.form-create-unit-instead-btn[openformeditunit="true"]')
      ),
      10000
    );
    const unitForm = await this.driver.findElement(
      By.css('.form-create-unit-instead-btn[openformeditunit="true"]')
    );
    const inputUnit = await unitForm.findElement(By.id('editUnitInput'));
    await this.driver.wait(until.elementIsEnabled(inputUnit), 10000);
    await inputUnit.clear();
    await this.driver.sleep(1000);
    await inputUnit.sendKeys(newUnit);
    await unitForm.findElement(By.id('editUnitBtnSave')).click();
    await this.driver.sleep(1000);
  }
}
module.exports = EditUnit;
