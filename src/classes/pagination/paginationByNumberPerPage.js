const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class PaginationByNumberPerPage extends Base {
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

  async executionOfPagination(numberofel) {
    await this.driver.wait(until.elementLocated(By.className('company-name')));
    const startElNumber = await this.driver.findElements(
      By.className('company-name')
    );

    const paginationDropDown = await this.driver.findElement(
      By.id('selectAmountItems')
    );
    await this.driver
      .actions()
      .scroll(0, 0, 0, 0, paginationDropDown)
      .perform();
    await paginationDropDown.click();

    const paginationList = await this.driver.findElements(
      By.className('ng-option')
    );
    await this.findDateInDropDown(paginationList, numberofel);
    await this.waitListDate('.company-name', 11);

    const endElNumber = await this.driver.findElements(
      By.className('company-name')
    );
    console.log(await endElNumber.length, 'end', await startElNumber.length);

    if (
      (await endElNumber.length) > (await startElNumber.length) &&
      (await endElNumber.length) <= numberofel
    ) {
      console.log('pagination by number per page work');
      return;
    } else {
      throw new Error('Pagination not work');
    }
  }
}

module.exports = PaginationByNumberPerPage;
