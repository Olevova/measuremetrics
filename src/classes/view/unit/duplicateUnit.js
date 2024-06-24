const { By, until } = require('selenium-webdriver');
const Base = require('../../base');

class DuplicateUnit extends Base {
  async duplicateUnitInformation() {
    await this.driver.wait(
      until.elementLocated(
        By.css('.cdk-drag[cdkdragpreviewcontainer="parent"]')
      ),
      10000
    );
    const units = await this.driver.findElements(
      By.css('.cdk-drag[cdkdragpreviewcontainer="parent"]')
    );
    const floors = await this.driver.findElements(
      By.css('.cdk-drag.floor-item')
    );
    if ((await units.length) > 0 && (await floors.length) > 1) {
      this.duplicateUnitName = await units[0]
        .findElement(By.css('.unit-name-wrapper'))
        .getAttribute('title');
      const rooms = await units[0].findElements(By.css('.rooms-list__item'));
      this.duplicateUniRoomsNumber = await rooms.length;
      this.firstFloorName = await floors[0].getAttribute('title');
      this.secondFloorName = await floors[1].getAttribute('title');
      await floors[1].click();
    } else {
      throw new Error('Insufficient number of Units or floors');
    }
  }

  async findAndClickDuplicate(floorname, element) {
    await this.driver.wait(
      until.elementsLocated(
        By.css('.duplicate-units-variants-floors-list__item')
      ),
      10000
    );
    const duplicateUnits = await this.driver.findElements(
      By.css('.duplicate-units-variants-floors-list__item')
    );
    let notDuplicate = false;
    for (const duplicate of duplicateUnits) {
      const duplicateName = await duplicate.getText();

      if ((await duplicateName.trim()) === floorname) {
        await duplicate.click();
        await this.driver.wait(
          until.elementsLocated(
            By.css('.duplicate-units-variants__item'),
            10000
          )
        );
        const unitsForDuplicate = await this.driver.findElements(
          By.css('.duplicate-units-variants__item')
        );

        for (const unit of unitsForDuplicate) {
          console.log('in unit for clone', await unit.getText());
          if ((await unit.getText()) === element) {
            await this.driver.wait(until.elementIsVisible(unit), 10000);
            await unit.click();
            notDuplicate = true;
            return;
          }
        }
      }
    }

    if (!notDuplicate) {
      throw new Error('It has not such duplicate in this project');
    }
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.duplicateUnitName = '';
    this.duplicateUniRoomsNumber = null;
    this.firstFloorName = '';
    this.secondFloorUnitsNumber = null;
    this.duplicatedUnitForDeleting = '';
  }
  //++++++++++++++++++++++++++++++++++++++++++++++=
  async duplicateUnitMeasureMetric() {
    let startTime;
    let endTime;
    let duplicateUnitTime;
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');

    await this.driver.wait(until.elementLocated(By.id('addUnit')), 10000);
    const addUnit = await this.driver.findElement(By.id('addUnit'));
    await this.driver.wait(until.elementIsEnabled(addUnit));
    await this.driver.actions().scroll(0, 0, 0, 0, addUnit).perform();
    await addUnit.click();
    await this.driver.wait(until.elementLocated(By.css('.add-floor-menu[openaddunitmenu]')),10000);
    await this.driver.wait(
      until.elementLocated(
        By.css('.duplicate-units-lists-wrapper')
      ),
      10000
    );
    const floorList = await this.driver.findElements(By.css('.duplicate-units-variants-floors-list__item'));
    
    await floorList[0].click()
    await this.driver.wait(until.elementLocated(By.css('.duplicate-units-variants-list')),10000);
    await this.waitListDate('.duplicate-units-variants__item',1);
    const unitsList = await this.driver.findElements(By.css('.duplicate-units-variants__item'));
    const unitsForDuplicate = await unitsList[0];
    await this.driver.wait(until.elementIsEnabled(unitsForDuplicate),10000);
    await this.driver.actions().scroll(0, 0, 0, 0, addUnit).perform();
    startTime = performance.now();
    this.duplicateUnitName = await unitsForDuplicate.getText();
    console.log(this.duplicateUnitName);
    await unitsForDuplicate.click()
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementLocated(By.css(`.unit-name-wrapper[title="${this.duplicateUnitName} #2"]`)))
    endTime = performance.now()
    duplicateUnitTime = endTime - startTime;
    await this.notificationCheck()
    await this.driver.sleep(500);
    return {'time to duplicate the unit': +duplicateUnitTime.toFixed(2)}
  }
  //++++++++++++++++++++++++++++++++++++++++++++++=
  async duplicateUnitBetweenFloor() {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.duplicateUnitInformation();

    await this.driver.wait(until.elementLocated(By.id('addUnit')), 10000);
    await this.driver.wait(
      until.elementLocated(
        By.css('.cdk-drag[cdkdragpreviewcontainer="parent"]')
      ),
      10000
    );
    await this.driver.sleep(2000);
    const unitsOfSecondFloor = await this.driver.findElements(
      By.css('.cdk-drag[cdkdragpreviewcontainer="parent"]')
    );
    this.secondFloorUnitsNumber = await unitsOfSecondFloor.length;
    const addUnit = await this.driver.findElement(By.id('addUnit'));
    await this.driver.wait(until.elementIsEnabled(addUnit));
    await this.driver.actions().scroll(0, 0, 0, 0, addUnit).perform();
    await addUnit.click();

    await this.driver.sleep(2000);
    await this.findAndClickDuplicate(
      this.firstFloorName,
      this.duplicateUnitName
    );
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.waitListDate(
      '.cdk-drag[cdkdragpreviewcontainer="parent"]',
      this.secondFloorUnitsNumber + 1
    );

    const unitsAll = await this.driver.findElements(
      By.css('.cdk-drag[cdkdragpreviewcontainer="parent"]')
    );
    if (this.secondFloorUnitsNumber < (await unitsAll.length)) {
      const unitsName = await this.driver.findElements(
        By.css('.unit-name-with-btn-wrapper')
      );
      for (const unit of unitsName) {
        const unitTitle = await unit
          .findElement(By.css('.unit-name-wrapper'))
          .getAttribute('title');
        if (await unitTitle.startsWith(this.duplicateUnitName)) {
          this.duplicatedUnitForDeleting = await unitTitle;
          console.log(await unitTitle);
          console.log('Unit was duplicate succesful');
          return;
        }
      }
    }
    throw new Error('Duplicate not work');
  }


  async duplicateUnit() {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');

    await this.driver.wait(until.elementLocated(By.id('addUnit')), 10000);
    const addUnit = await this.driver.findElement(By.id('addUnit'));
    await this.driver.wait(until.elementIsEnabled(addUnit));
    await this.driver.actions().scroll(0, 0, 0, 0, addUnit).perform();
    await addUnit.click();
    await this.driver.wait(until.elementLocated(By.css('.add-floor-menu[openaddunitmenu]')),10000);
    await this.driver.wait(
      until.elementLocated(
        By.css('.duplicate-units-lists-wrapper')
      ),
      10000
    );
    const floorList = await this.driver.findElements(By.css('.duplicate-units-variants-floors-list__item'));
    await floorList[0].click()
    await this.driver.wait(until.elementLocated(By.css('.duplicate-units-variants-list')),10000);
    await this.waitListDate('.duplicate-units-variants__item',1);
    const unitsList = await this.driver.findElements(By.css('.duplicate-units-variants__item'));
    const unitsForDuplicate = await unitsList[0];
    await this.driver.wait(until.elementIsEnabled(unitsForDuplicate),10000);
    await this.driver.actions().scroll(0, 0, 0, 0, addUnit).perform();
  
    await unitsForDuplicate.click()
    await this.driver.executeScript('return document.readyState');
    await this.notificationCheck()
    await this.driver.sleep(500);
  }



  async deleteDuplicateUnit() {
    await this.driver.wait(until.elementLocated(By.id('addUnit')), 10000);
    await this.driver.wait(
      until.elementLocated(
        By.css('.cdk-drag[cdkdragpreviewcontainer="parent"]')
      ),
      10000
    );
    await this.driver.wait(
      until.elementsLocated(By.css('.unit-name-with-btn-wrapper')),
      10000
    );
    const units = await this.driver.findElements(
      By.css('.unit-name-with-btn-wrapper')
    );
    for (let item of units) {
      let noBtn = false;
      if (item) {
        const unitName = await item
          .findElement(By.css('.unit-name-wrapper'))
          .getAttribute('title');
        if ((await unitName) === this.duplicatedUnitForDeleting) {
          const menuBtn = await item.findElement(By.id('menuListAddRoomOpen'));
          await this.driver.wait(until.elementIsEnabled(menuBtn), 10000);
          noBtn = true;
          await menuBtn.click();
          const menu = await this.driver.findElement(
            By.css('.editMenuList[editmenuunitopen]')
          );

          // await menu.wait(until.elementLocated(By.id('deleteUnitBtn')),10000);
          const delUnitBtn = await menu.findElement(By.id('deleteUnitBtn'));
          await this.driver.wait(until.elementIsEnabled(delUnitBtn), 10000);
          this.driver.sleep(1000);
          await delUnitBtn.click();
          break;
        }
      }
    }

    await this.driver.wait(
      until.elementLocated(By.css('.backdrop[show="true"]')),
      10000
    );

    const modal = await this.driver.findElement(
      By.css('.backdrop[show="true"]')
    );
    const confirmDelBtn = await modal.findElement(By.id('btnDeleteProject'));
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementIsEnabled(confirmDelBtn), 10000);
    await confirmDelBtn.click();
    await this.notificationCheck();
    const unitsAfterDeleteUnit = await this.driver.findElements(
      By.css('.unit-name-wrapper')
    );
    for (const unit of unitsAfterDeleteUnit) {
      if (
        (await unit.getAttribute('title')) === this.duplicatedUnitForDeleting
      ) {
        throw new Error('Unit duplicate is not delete');
      }
    }
    console.log('Unit Duplicate deleted succesful');
    await this.driver.sleep(1000);
  }
}

module.exports = DuplicateUnit;
