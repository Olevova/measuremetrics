const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class CreateCompany extends Base {
  
  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.companyName = '';
    this.endCompanyNumber = 0;
    this.startCompanyNumber = 0;
  }

  async goToCreateCompanyForm() {
    const companyBtn = await this.driver.findElement(By.id('linkCompanies'));
    await companyBtn.click();

    // this.startCompanyNumber = await CreateCompany.numberOfCompanies(this.driver);
    this.startCompanyNumber = await this.numberOfItems(this.driver);

    const createCompanyBtn = await this.driver.findElement(By.id('btnCreate'));
    await createCompanyBtn.click();
  }

  async fillCreateCompany(
    name,
    street,
    app,
    state,
    city,
    zipcode,
    phone,
    email,
    plan,
    type
  ) {
    const createForm = this.driver.findElement(By.className('modal'));
    await this.driver.wait(until.elementIsEnabled(createForm), 10000);

    const companyName = await this.driver.findElement(By.id('companyName'));
    await companyName.sendKeys(name);

    const addressStreet = await this.driver.findElement(
      By.id('companyAddress')
    );
    await addressStreet.sendKeys(street);

    const addressApart = await this.driver.findElement(
      By.id('companyAddressSecond')
    );
    await addressApart.sendKeys(app);

    const stateDropdown = await this.driver.findElement(By.id('companyState'));
    await stateDropdown.click();
    const stateList = await this.driver.findElements(By.className('ng-option'));
    await this.findDateInDropDown(stateList, state);

    const cityDropDown = await this.driver.findElement(By.id('companyCity'));
    await cityDropDown.click();
    const cityList = await this.driver.findElements(By.className('ng-option'));
    await this.findDateInDropDown(cityList, city);

    const companyZip = await this.driver.findElement(By.id('companyZipCode'));
    await companyZip.sendKeys(zipcode);

    const companyPhone = await this.driver.findElement(By.id('companyPhone'));
    await companyPhone.sendKeys(phone);

    const companyEmail = await this.driver.findElement(By.id('companyEmail'));
    await companyEmail.sendKeys(email);

    const companyPlan = await this.driver.findElement(By.id('companyPlan'));
    await companyPlan.click();
    await this.driver.sleep(1000);
    const planList = await this.driver.findElements(By.className('ng-option'));
    await this.findDateInDropDown(planList, plan)

    const typeDropDown = await this.driver.findElement(By.id('companyType'));
    await typeDropDown.click();

    const typeList = await this.driver.findElements(By.className('ng-option'));
    await this.findDateInDropDown(typeList, type);

    const createBtn = await this.driver.findElement(By.id('btnSubmit'));
    // await this.driver.sleep(2000)
    createBtn.click();
  }

  async checkCreationOfNewCompany() {
    await this.notificationCheck('id','mainErrorText');
   
    this.endCompanyNumber = await this.numberOfItems(this.driver);
    try {
      console.log('number of companies before',this.startCompanyNumber,'after', this.endCompanyNumber, 'company created successfully');

      if (this.startCompanyNumber >= this.endCompanyNumber) {
        throw new Error('company didnt create');
      }

      return;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = CreateCompany;
