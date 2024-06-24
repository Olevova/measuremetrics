const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class RemoveCompany extends Base {
  
  static async findCompanyInList(array, companyName) {
    let companyForSearch = '';
    let companyFound = false;

    for (let i = 0; i < array.length; i += 1) {
      companyForSearch = await array[i].getText();
      // console.log(companyForSearch, 'companny');

      if (companyForSearch === companyName) {
        companyFound = true;
        await array[i].click();
        break;
      }
    }

    if (!companyFound) {
      console.log('Not such company');
      throw new Error('No such company in the list of company');
    }
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async goToCompanyList() {
    const companyBtn = await this.driver.findElement(By.id('linkCompanies'));
    await companyBtn.click();

    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementLocated(By.id('selectAmountItems')),
      10000
    );

    const paginationDropDown = await this.driver.findElement(
      By.id('selectAmountItems')
    );
    await this.driver
      .actions()
      .scroll(0, 0, 0, 0, paginationDropDown)
      .perform();

    const totalEl = await this.driver
      .findElement(By.className('total-item-text'))
      .getText();
    const numberEl = totalEl.split(' ');
    const numberOfCompanies = Number(numberEl[numberEl.length - 1]);

    if (numberOfCompanies > 10) {
      await paginationDropDown.click();
      const paginationList = await this.driver.findElements(
        By.className('ng-option')
      );
      await this.findDateInDropDown(paginationList, '100');
      await this.waitListDate('.company-name', 11);
    }
  }

  async findCompany(company, page) {
    // await this.driver.sleep(1000)
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.urlIs(page), 10000);

    const allCompanies = await this.driver.findElements(
      By.className('company-name')
    );
    await this.driver.wait(
      until.elementsLocated(By.className('company-name')),
      10000
    );

    if (allCompanies) {
      await RemoveCompany.findCompanyInList(allCompanies, company);
    }
  }

  async removefindCompany(companyName) {
    await this.driver.executeScript('return document.readyState');

    await this.driver.wait(
      until.elementLocated(By.id('linkCompanySettings')),
      10000
    );
    const companyBtn = await this.driver.findElement(
      By.id('linkCompanySettings')
    );

    await companyBtn.click();
    await this.driver.wait(
      until.elementLocated(By.id('btnDeleteCompanyOpenModal'))
    );
    const delBtn = await this.driver.findElements(
      By.id('btnDeleteCompanyOpenModal')
    );

    await delBtn[0].click();

    const modal = this.driver.findElement(By.className('modal'));
    await this.driver.wait(until.elementIsEnabled(modal), 10000);

    const delBtnModal = await this.driver.findElement(By.id('btnDelete'));
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.wait(until.elementIsEnabled(delBtnModal), 10000);
    await delBtnModal.click();

    await this.driver.wait(
      until.elementsLocated(By.className('notification')),
      10000
    );
    const windowHandles = await this.driver.findElement(
      By.className('notification')
    );
    const windowHandlesText = await windowHandles.getText();

    if (windowHandlesText === 'Error. Failed to save data') {
      throw new Error('You have error, check screenshot');
    }

    try {
      await this.driver.wait(
        until.elementsLocated(By.className('company-name')),
        3000
      );
      const allCompaniesAfterDel = await this.driver.findElements(
        By.className('company-name')
      );

      const isCompanyRemoved = allCompaniesAfterDel.every(
        async i => (await i.getText()) !== companyName
      );

      if (isCompanyRemoved) {
        return;
      } else {
        throw new Error('Company did not remove');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async removeCompanyViaThreeDotsMenu(companyName){
    await this.driver.wait(until.elementsLocated(By.css('.list-name-wrapper')),10000);
    await this.findItemAndOpenThreeDotsMenu(companyName,'.list-name-wrapper');
    await this.driver.wait(until.elementLocated(By.css('#dotsMenu[editmenuopen]')),10000);
    const deleteBtn = await this.driver.findElement(By.css('#dotsMenu[editmenuopen] #deleteItem'))
    await this.driver.wait(until.elementIsVisible(deleteBtn), 10000);
    await this.driver.wait(until.elementIsEnabled(deleteBtn), 10000);
    await deleteBtn.click();
    await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"]')),10000);
    await this.driver.wait(until.elementLocated(By.css('.modal')),10000);
    const modal = this.driver.findElement(By.className('modal'));
    await this.driver.wait(until.elementIsEnabled(modal), 10000);
    const delCompanyBtn = await this.driver.findElement(By.id('btnDelete'));
    await this.driver.wait(until.elementIsEnabled(delCompanyBtn), 10000);
    await delCompanyBtn.click();
    await this.notificationCheck();
    await this.checkDeleteItem('.company-name', companyName);
  }
}

module.exports = RemoveCompany;
