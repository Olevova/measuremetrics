const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class PaginationByArrow extends Base {
  static async waitNewListDate(driver, name, selector) {
    let element = name;
    let count = 0;

    while (name === element && count < 10) {
      const list = await driver.findElements(By.css(selector));
      element = await list[0]?.getText();

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

    if (this.startEntiteNumber <= 10) {
      throw new Error('Lack of Entities for Pagination');
    }
  }

  async executionOfPagination() {
    await this.driver.wait(until.elementLocated(By.className('company-name')));
    const startElNumber = await this.driver.findElements(
      By.className('company-name')
    );
    const firstElName = await startElNumber[0].getText();

    const paginationArrow = await this.driver.findElement(By.id('btnNextPage'));
    await this.driver.actions().scroll(0, 0, 0, 0, paginationArrow).perform();
    await paginationArrow.click();

    const paginationBtn = await this.driver.findElements(
      By.css('.pagination-list__item:not(.hidden)')
    );
    await PaginationByArrow.waitNewListDate(
      this.driver,
      firstElName,
      '.company-name'
    );
    const endElNumber = await this.driver.findElements(
      By.className('company-name')
    );

    const activeBtn = await paginationBtn[1].getAttribute('current');
    const leftArrow = await this.driver.wait(
      until.elementLocated(By.id('btnPrevPage'), 10000)
    );

    if (
      (await endElNumber[0].getText()) !== firstElName &&
      activeBtn === 'true' &&
      leftArrow
    ) {
      console.log('Pagination by arrow work');
      return;
    } else {
      throw new Error('Pagination not work');
    }
  }
}

module.exports = PaginationByArrow;
