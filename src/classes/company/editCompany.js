const { By, until } = require('selenium-webdriver');
const RemoveCompany = require('../company/removeCompany');

class EditCompany extends RemoveCompany {

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.companyName = '';
    this.endCompanyNumber = 0;
    this.startCompanyNumber = 0;
  }

 async editCompany(newName){
    await this.driver.executeScript('return document.readyState');

    await this.driver.wait(
      until.elementLocated(By.id('linkCompanySettings')),
      10000
    );
    const companyBtn = await this.driver.findElement(
      By.id('linkCompanySettings')
    );
    await companyBtn.click();
    await this.driver.wait(until.elementLocated(By.css('.settings-wrapper__btn-edit')),10000);
    const editBtn = this.driver.findElement(By.css('.settings-wrapper__btn-edit'));
    await this.driver.wait(until.elementIsEnabled(editBtn),10000);
    await editBtn.click();
    await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"]')),10000);
    const nameInput = await this.driver.findElement(By.id('companyName'));
    await nameInput.clear();
    await nameInput.sendKeys(newName);
    const submitBtn = await this.driver.findElement(By.id('btnSubmit'));
    await submitBtn.click();
    await this.notificationCheck('id','mainErrorText');
    console.log(`New Company name ${newName}`);
 }

 async editCompanyPlan(planeName, customs=100){
  await this.driver.executeScript('return document.readyState');

  await this.driver.wait(
    until.elementLocated(By.id('linkCompanySettings')),
    10000
  );
  const companyBtn = await this.driver.findElement(
    By.id('linkCompanySettings')
  );
  await companyBtn.click();
  await this.driver.wait(until.elementLocated(By.css('.settings-wrapper__btn-edit')),10000);
  const editBtn = this.driver.findElement(By.css('.settings-wrapper__btn-edit'));
  await this.driver.wait(until.elementIsEnabled(editBtn),10000);
  await editBtn.click();
  await this.driver.sleep(1000)
  await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"]')),10000);
  const companyPlan = await this.driver.findElement(By.id('companyPlan'));
  await companyPlan.click();
  await this.driver.wait(until.elementLocated(By.css('.ng-dropdown-panel-items')),10000);
  const planList = await this.driver.findElements(By.css('.ng-option'));
  for(let i of planList){
    console.log(await i.getText(), 'tut');
  }
  if(planeName ==='Custom'){
    console.log("in customs");
    await this.findDateInDropDown(planList, planeName);
    await this.driver.wait(until.elementLocated(By.id('companyPlanMaxNumberUsers')));
    const numberOfUser = await this.driver.findElement(By.id('companyPlanMaxNumberUsers'));
    await numberOfUser.clear();
    await numberOfUser.sendKeys(customs);

  }else {
    console.log("not customs");
    await this.findDateInDropDown(planList, planeName);
    }
    const submitBtn = await this.driver.findElement(By.id('btnSubmit'));
    await submitBtn.click();
    await this.notificationCheck('id','mainErrorText');
 }

 async checkCompanyPlane(plane, users=100){
  await this.driver.executeScript('return document.readyState');

  await this.driver.wait(
    until.elementLocated(By.id('linkCompanySettings')),
    10000
  );
  const companyBtn = await this.driver.findElement(
    By.id('linkCompanySettings')
  );
  await companyBtn.click();
  console.log("here in");
  await this.driver.wait(until.elementLocated(By.css('.table-details-wrapper')),10000);
  const tableDetaile = await this.driver.findElement(By.css('.table-details-wrapper'));
  const tableDate = await tableDetaile.findElements(By.css(".table-details__title"));
  let planeOfCompany;
  let peopleInPlane;
  for (let cell of tableDate){
    let cellName = await cell.getText();
    if (cellName === 'Plan'){
      let parentElement = await cell.findElement(By.xpath('..'));
      let nextCell = await parentElement.findElement(By.css('.table-details__info'));
      console.log(await nextCell.getText());
      planeOfCompany = await nextCell.getText();
    }
    if(cellName === 'Users'){
      let parentElement = await cell.findElement(By.xpath('..'));
      let nextCell = await parentElement.findElement(By.css('.table-details__info'));
      console.log(await nextCell.getText());
      const usersNumber = await nextCell.getText();
      const usersNumberArray = await usersNumber.split('/');
      peopleInPlane =await usersNumberArray[usersNumberArray.length-1]

    }
    
  }
  if(plane === planeOfCompany && users === Number(peopleInPlane)){
    console.log(`test passed, company plane is ${planeOfCompany} with ${peopleInPlane} users`);
  }
 else{
  throw new Error (`Check screenshot, here your plane: ${planeOfCompany} and number of users ${peopleInPlane}`)
 }
 }


}

module.exports = EditCompany;
