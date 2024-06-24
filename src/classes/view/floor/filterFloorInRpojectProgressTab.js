const { By, until } = require('selenium-webdriver');
const Base = require('../../base');

class FilterFloor extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.floorList = [];
    this.floorListAfterResetFilter = [];
    this.filterItem = '';
  }
  async checkFloorInProjectProgressTab() {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(
        By.css('.floors-list__item .floor-cell-name[title]')
      ),
      10000
    );
    const floors = await this.driver.findElements(
      By.css('.floors-list__item .floor-cell-name[title]')
    );
    if ((await floors.length) < 1) {
      throw new Error('Project has no Floors');
    }
    for (let floor of floors) {
      const floorName = await floor.getAttribute('title');
      this.floorList.push(floorName);
    }
    console.log(this.floorList);
  }
  async filterByFirstRoom() {
    await this.driver.wait(until.elementLocated(By.id('filter-floors')), 10000);
    const filterBtn = await this.driver.findElement(By.id('filter-floors'));
    await this.driver.wait(until.elementIsEnabled(filterBtn), 10000);
    await filterBtn.click();
    await this.driver.wait(
      until.elementLocated(By.css('.filters-list-wrapper[visible="true"]')),
      10000
    );
    const floorsCheckBox = await this.driver.findElements(
      By.css('.filters-list__item')
    );
    this.filterItem = await floorsCheckBox[0].getText();
    await this.driver.wait(
      until.elementsLocated(By.css('.filters-list__item .checkbox-container')),
      10000
    );

    const checkBoxs = await this.driver.findElements(
      By.css('.filters-list__item .checkbox-container')
    );
    await this.driver.wait(until.elementIsEnabled(checkBoxs[0]), 10000);
    await checkBoxs[0].click();
    await this.driver.findElement(By.css('.btn-filters')).click();
  }

  async checkOfFilterOperationByFloors() {
    await this.driver.wait(
      until.elementLocated(By.css('.filters-list-wrapper[visible="false"]')),
      10000
    );
    const filterFloorForCheck = await this.driver.findElements(
      By.css('.floors-list__item .floor-cell-name[title]')
    );
    const titleOfFilterFloor = await filterFloorForCheck[0].getAttribute(
      'title'
    );
    console.log(titleOfFilterFloor, filterFloorForCheck.length);
    if (
      titleOfFilterFloor === this.filterItem &&
      filterFloorForCheck.length === 1
    ) {
      console.log('Floor filter is working');
    } else {
      throw new Error('Filter is not working');
    }
    // await this.driver.sleep(1000);
  }
  async resetFilterAndCheckResult() {
    await this.driver.wait(
      until.elementLocated(
        By.css('#filter-floors .filters-icon.close-icon-forCheck')
      ),
      10000
    );
    const resetFilterBtn = await this.driver.findElement(
      By.css('#filter-floors .filters-icon.close-icon-forCheck')
    );
    await resetFilterBtn.click();
    await this.driver.wait(
      until.elementLocated(By.css('#filter-floors[amountfilters="0"]')),
      10000
    );
    await this.driver.wait(
      until.elementsLocated(
        By.css('.floors-list__item .floor-cell-name[title]')
      ),
      10000
    );
    const floors = await this.driver.findElements(
      By.css('.floors-list__item .floor-cell-name[title]')
    );
    if ((await floors.length) < 1) {
      throw new Error('Project has no Floors');
    } else {
      for (let floor of floors) {
        let name = await floor.getAttribute('title');
        this.floorListAfterResetFilter.push(name);
      }
      if (
        JSON.stringify(this.floorListAfterResetFilter) ===
        JSON.stringify(this.floorListAfterResetFilter)
      ) {
        console.log('Reset filter works');
      } else {
        throw new Error('Reset filter does not work');
      }
    }
  }
}
module.exports = FilterFloor;
