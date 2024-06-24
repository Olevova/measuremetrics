const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class PaginationByButton extends Base {
  static async waitNewListDate(driver, name, selector) {
    let element = name;
    let count = 0;

    while (name === element && count < 10) {
      const list = await driver.findElements(By.css(selector));
      const firstElement = await list[0]
      element = await firstElement?.getText();
      if (element === name || element===undefined) {
        await driver.sleep(1000);
        count += 1;
      }
    }
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.startEntiteNumber = 0;
  }

  async goToProjectsPage() {
    const projectsBtn = await this.driver.findElement(By.id('linkCompanies'));
    await projectsBtn.click();

    this.startEntiteNumber = await this.numberOfItems(this.driver);
    console.log(this.startEntiteNumber);

    if (this.startEntiteNumber <= 10) {
      throw new Error('Lack of Entities for Pagination');
    }
  }

  async executionOfPagination() {
    await this.driver.wait(until.elementLocated(By.className('company-name')),10000);
    const startElNumber = await this.driver.findElements(
      By.className('company-name')
    );
    const firstElName = await startElNumber[0].getText();

    const paginationDropDown = await this.driver.findElements(
      By.css('.pagination-list__item:not(.hidden)')
    );
    await this.driver
      .actions()
      .scroll(0, 0, 0, 0, paginationDropDown[0])
      .perform();
    await paginationDropDown[1].click();

    await PaginationByButton.waitNewListDate(
      this.driver,
      firstElName,
      '.company-name'
    );
    const endElNumber = await this.driver.findElements(
      By.className('company-name')
    );
    const activeBtn = await paginationDropDown[1].getAttribute('current');

    if (
      (await endElNumber[0].getText()) !== firstElName &&
      activeBtn === 'true'
    ) {
      console.log('pagination by button work');
      return;
    } else {
      throw new Error('Pagination not work');
    }
  }
}

module.exports = PaginationByButton;
