const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class CreateProject extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.startProjectsNumber = 0;
    this.endProjectsNumber = 0;
  }

  async goToProjectListMeasureTime(user = 'sa') {
    let startTime;
    let endTime;
    let loadProjectListTime;
   

    if (user === 'sa') {
      const projectBtnSa = await this.driver.findElement(By.id('linkProjects'));
      startTime = performance.now();

      await projectBtnSa.click();
      await this.driver.wait(
        until.elementsLocated(By.css('li.table-projects__row')),
        10000
      );
      const firstProject = await this.driver.findElements(
        By.css('li.table-projects__row')
      );
      await this.driver.wait(until.elementIsEnabled(firstProject[0]));
      endTime = performance.now();
      loadProjectListTime = endTime - startTime;
      console.log(`Projects list load time: ${loadProjectListTime} ms`);
      
    } else {
      await this.driver.sleep(1000);
      await this.driver.findElement(By.id('btnCreate'));
      startTime = performance.now();
      await this.driver.wait(
        until.elementsLocated(By.css('li.table-projects__row')),
        10000
      );
      const firstProject = await this.driver.findElements(
        By.css('li.table-projects__row')
      );
      await this.driver.wait(until.elementIsEnabled(firstProject[0]));
      endTime = performance.now();
      loadProjectListTime = endTime - startTime;
      // console.log(`Projects list load time: ${loadProjectListTime} ms`);
    }
    
    return {'project list load time': +loadProjectListTime.toFixed(2)}
  }

  async fillCreateProjectFieldsMeasureTime(
    name,
    key,
    number,
    company,
    street,
    app,
    state,
    city,
    zipcode,
    client,
  ) {
    let startTime;
    let endTime;
    let formOpenTime;
    let formCloseTime;
    let projectAppearTime;

    const creatProject = await this.driver.findElement(By.id('btnCreate'));
    startTime = performance.now()
    await creatProject.click();
    await this.driver.wait(
      until.elementLocated(By.css('app-project-form .backdrop[show="true"]')),
      10000
    );
    const projectCreateForm = await this.driver.findElement(By.css('app-project-form .backdrop[show="true"]'));
    endTime = performance.now();
    formOpenTime = endTime - startTime;
    const projectName = await this.driver.findElement(By.id('projectName'));
    await projectName.click()
    await this.driver.sleep(1000);
    await projectName.sendKeys(name);
    await this.driver.sleep(1000);
    
    await this.driver.wait(until.elementLocated(By.id('projectNumber')), 10000);

    let projectNumber = await this.driver.findElement(By.id('projectNumber'));
    await projectName.click()
    await this.driver.sleep(1000);
    await projectNumber.sendKeys(number);
    await this.driver.sleep(1000);
    const companyProjectBelong = await this.driver.findElement(
      By.id('projectSelectCompany')
    );
    await companyProjectBelong.click();

    await this.driver.executeScript('return document.readyState');

    await this.waitListDate('.ng-option', 2);
    const companyList = await this.driver.findElements(
      By.className('ng-option')
    );

    await this.findDateInDropDown(companyList, company);
    const addressStreet = await this.driver.findElement(
      By.id('projectAddress')
    );

    await addressStreet.click();
    await this.driver.sleep(1000);
    await addressStreet.sendKeys(street);

    const addressApart = await this.driver.findElement(
      By.id('projectAddressSecond')
    );
    await addressApart.click();
    await this.driver.sleep(1000);
    await addressApart.sendKeys(app);

    const stateDropDown = await this.driver.findElement(
      By.id('projectSelectState')
    );
    await stateDropDown.click();
    const stateList = await this.driver.findElements(By.className('ng-option'));

    await this.findDateInDropDown(stateList, state);

    const cityDropDown = await this.driver.findElement(
      By.id('projectSelectCity')
    );
    await cityDropDown.click();
    const cityList = await this.driver.findElements(By.className('ng-option'));
    await this.findDateInDropDown(cityList, city);

    const projectZip = await this.driver.findElement(By.id('projectZipCode'));
    await projectZip.click();
    await this.driver.sleep(1000);
    await projectZip.sendKeys(zipcode);

    const projectClientName = await this.driver.findElement(
      By.id('projectClientName')
    );
    await projectClientName.click();
    await this.driver.sleep(1000);
    await projectClientName.sendKeys(client);
    await projectClientName.click();
    // await projectNumber.clear();
    // await projectNumber.sendKeys(number);
    await this.driver.sleep(1000);
    const projectKey = await this.driver.findElement(By.id('projectCode'));
    if(key){
      await projectKey.click()
      await projectKey.clear();
      await this.driver.sleep(1000);
      await projectKey.sendKeys(key);
      // await this.driver.sleep(1000);
    }
    
    const createBtn = await this.driver.findElement(By.id('btnSubmit'));

    await this.driver.sleep(1000);
    startTime = performance.now();
    createBtn.click();
    await this.driver.wait(until.stalenessOf(projectCreateForm), 10000);
    endTime = performance.now();
    formCloseTime = endTime - startTime;

    console.log(`Close form time: ${formCloseTime} ms`);
    await this.waitListDate('.list-name-wrapper', 1);
    await this.checkCreateItem('.list-name-wrapper', name);
    const projects = await this.driver.findElements(By.css('.list-name-wrapper'));
    const firstProject = await projects[0]
    await this.driver.wait(until.elementIsEnabled(firstProject),10000);
    endTime = performance.now();
    projectAppearTime = endTime - startTime
   

    console.log('formOpenTime:',formOpenTime,'formCloseTime:',formCloseTime,'projectAppearTime:', projectAppearTime);
    return {'form load time for project creation': +formOpenTime.toFixed(2),'project creation form closing time': +formCloseTime.toFixed(2),'time for the project to appear in the list of projects': +projectAppearTime.toFixed(2)}
  }


  async goToProjectDetailsPageMeasureTime(projectTitle) {
    let endTime
    let startTime
    let projectDetailsPageOpen
    const listOfLink = await this.driver.findElements(By.css('.project-name__wrapper'));
    let notFindeLink = true;
    for (let linkTag of listOfLink) {
      const linkText = await linkTag.getText();
      // console.log(linkText);
      if ((await linkText.toLowerCase().trim()) === projectTitle.toLowerCase()) {
        startTime = performance.now();
        await linkTag.click();
        notFindeLink = false;
        break;
      }
    }
    if (notFindeLink) {
      throw new Error('It is not such link');
    }
   
    await this.driver.wait(until.elementLocated(By.css('.floors-wrapper')),10000)
    await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('.floors-wrapper'))), 10000);
    await this.driver.wait(until.elementLocated(By.css('#unitListId')),10000)
    await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('#unitListId'))), 10000);
    endTime = performance.now();
    projectDetailsPageOpen = endTime - startTime
    console.log(projectDetailsPageOpen);
    return {'time to open project page': +projectDetailsPageOpen.toFixed(2)}
  }

  // ====================================================================//


  async goToCreateProjectForm(user = 'sa') {
    if (user === 'sa') {
      const projectBtnSa = await this.driver.findElement(By.id('linkProjects'));
      await projectBtnSa.click();
      this.startProjectsNumber = await this.numberOfItems(this.driver);
    }

    if (user !== 'sa') {
      await this.driver.sleep(1000);
    }
    const creatProject = await this.driver.findElement(By.id('btnCreate'));
    await creatProject.click();
  }

  async fillCreateProjectFields(
    name,
    key,
    number,
    company,
    street,
    app,
    state,
    city,
    zipcode,
    client,
    startdate,
    enddate
  ) {
    await this.driver.wait(
      until.elementLocated(By.css('.backdrop[show="true"]')),
      10000
    );
    const projectName = await this.driver.findElement(By.id('projectName'));
    await projectName.sendKeys(name);
    await this.driver.sleep(1000);
    const projectKey = await this.driver.findElement(By.id('projectCode'));
    // await projectKey.clear();
    // await projectKey.click();
    await projectKey.sendKeys(key);
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementLocated(By.id('projectNumber')), 10000);

    let projectNumber = await this.driver.findElement(By.id('projectNumber'));

    await projectNumber.sendKeys(number);

    const companyProjectBelong = await this.driver.findElement(
      By.id('projectSelectCompany')
    );
    await companyProjectBelong.click();

    await this.driver.executeScript('return document.readyState');

    await this.waitListDate('.ng-option', 2);
    const companyList = await this.driver.findElements(
      By.className('ng-option')
    );

    await this.findDateInDropDown(companyList, company);
    const addressStreet = await this.driver.findElement(
      By.id('projectAddress')
    );

    await addressStreet.click();
    await addressStreet.sendKeys(street);

    const addressApart = await this.driver.findElement(
      By.id('projectAddressSecond')
    );
    await addressApart.click();
    await addressApart.sendKeys(app);

    const stateDropDown = await this.driver.findElement(
      By.id('projectSelectState')
    );
    await stateDropDown.click();
    const stateList = await this.driver.findElements(By.className('ng-option'));

    await this.findDateInDropDown(stateList, state);

    const cityDropDown = await this.driver.findElement(
      By.id('projectSelectCity')
    );
    await cityDropDown.click();
    const cityList = await this.driver.findElements(By.className('ng-option'));
    await this.findDateInDropDown(cityList, city);

    const projectZip = await this.driver.findElement(By.id('projectZipCode'));
    await projectZip.click();
    await projectZip.sendKeys(zipcode);

    const projectClientName = await this.driver.findElement(
      By.id('projectClientName')
    );
    await projectClientName.click();
    await projectClientName.sendKeys(client);

    await projectNumber.clear();
    await projectNumber.sendKeys(number);
    await this.driver.sleep(1000);
    const createBtn = await this.driver.findElement(By.id('btnSubmit'));

    await this.driver.sleep(1000);
    createBtn.click();
    // await projectNumber.clear();
    // await projectNumber.sendKeys(number);
    // await this.driver.sleep(1000)
    // createBtn.click();
    await this.notificationCheck('id', 'mainErrorText');
    // console.log("all ok sa 2");
    await this.checkCreateItem('.list-name-wrapper', name);
  }

}

module.exports = CreateProject;
