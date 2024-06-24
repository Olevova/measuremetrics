const { By, until } = require('selenium-webdriver');
const Base = require('../../base');

class ChangeAreaStatus extends Base {
 
  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.statusNow = '';
    this.progress = '0 %';
  }
//++++++++++++++++++++++++++++++++++++++++++++++++=
async changeStatusToDoOnInProgressMeasureMetrics() {
  let startTime;
  let endTime;
  let dropDownShowTime;
  let savedStatusTime;
  const inputEl = this.driver.findElement(By.className('ng-input'));
  await this.driver.wait(until.elementIsEnabled(inputEl), 10000);
  startTime = performance.now();
  await inputEl.click();
  await this.waitListDate('.ng-option-label', 1);
  const statusElements = this.driver.findElements(By.css('.ng-option-label'));
  endTime = performance.now();
  dropDownShowTime = endTime - startTime;
  startTime = performance.now();
  await this.findDateInDropDown(await statusElements, 'In Progress');
  await this.notificationCheck();
  await this.checkAreaStatus('IN_PROGRESS');
  endTime = performance.now();
  savedStatusTime = endTime - startTime;
  const statusProgressProcent = await this.driver.findElement(
    By.css('.status-progress-percent')
  );
  if ((await statusProgressProcent.getText()) !== '0%') {
    throw new Error('Progress Status Procent must be 0%');
  }
  console.log(await statusProgressProcent.getText());
  return{
    'dropdown show statuses time': +dropDownShowTime.toFixed(2),
    'saved new areas status time': +savedStatusTime.toFixed(2)
    }
}

//++++++++++++++++++++++++++++++++++++++++++++++++=
  async checkStartProgressProjectPercent(){
    await this.driver.sleep(1000);
    const projectProgres = await this.driver.findElement(
      By.css('.project-status-wrapper span')
    );
    this.progress= parseInt(await projectProgres.getText(), 10);
    console.log(`Start project percent status: ${this.progress} %`);
   };

  async findAreaInView(status = '-3') {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementsLocated(By.css('.room-areas-list__item.ng-star-inserted')),
      10000
    );

    const areas = await this.driver.findElements(
      By.css(`[areastatus='${status}']`)
    );
    const firstArea = await areas[0];
    if (!(await firstArea)) {
      throw new Error('It has not area with status To Do');
    }
    console.log(
      await firstArea.getAttribute('areastatus'),
      await firstArea.getText()
    );
    await firstArea.click();

    await this.driver.wait(
      until.elementLocated(By.id('areaStatusSelect')),
      10000
    );
  }

  async changeStatusToDoOnInProgress() {
    const inputEl = this.driver.findElement(By.className('ng-input'));
    await this.driver.wait(until.elementIsEnabled(inputEl), 10000);
    await inputEl.click();
    await this.waitListDate('.ng-option-label', 1);
    const statusElements = this.driver.findElements(By.css('.ng-option-label'));
    await this.findDateInDropDown(await statusElements, 'In Progress');
    await this.notificationCheck();
    await this.checkAreaStatus('IN_PROGRESS');
    const statusProgressProcent = await this.driver.findElement(
      By.css('.status-progress-percent')
    );
    if ((await statusProgressProcent.getText()) !== '0%') {
      throw new Error('Progress Status Procent must be 0%');
    }
    console.log(await statusProgressProcent.getText());
  }

  async changeColorProgressStatusByClick() {
    await this.driver.wait(
      until.elementLocated(By.css('.area-details-progress')),
      10000
    );
    const statusProgressElements = await this.driver.findElements(
      By.css('.area-status-progress-list__item')
    );
    const fifthProcentEl = await statusProgressElements[4];
    await this.driver.wait(until.elementIsEnabled(fifthProcentEl), 10000);
    await fifthProcentEl.click();
    await this.driver.wait(
      until.elementLocated(By.className('btn-confirm')),
      10000
    );
    const confirmBtn = this.driver.findElement(By.className('btn-confirm'));
    await this.driver.wait(until.elementIsEnabled(confirmBtn), 10000).click();
    await this.notificationCheck();
    const statusProgressProcent = await this.driver.findElement(
      By.css('.status-progress-percent')
    );
    if ((await statusProgressProcent.getText()) !== '50%') {
      throw new Error('Progress Status Procent must be 50%');
    }
    console.log(
      'Status was changed and now it:',
      await statusProgressProcent.getText()
    );
  }

  async changeColorProgressStatusByBtn() {
    await this.driver.wait(
      until.elementLocated(By.css('.area-details-progress')),
      10000
    );
    const statusProgressBtns = await this.driver.findElements(
      By.css('.change-status-progress-btn')
    );
    const minusBtn = await statusProgressBtns[0];
    await this.driver.wait(until.elementIsEnabled(minusBtn), 10000);
    await minusBtn.click();
    await this.driver.wait(
      until.elementLocated(By.className('btn-confirm')),
      10000
    );
    const confirmBtn = this.driver.findElement(By.className('btn-confirm'));
    await this.driver.wait(until.elementIsEnabled(confirmBtn), 10000).click();
    await this.notificationCheck();
    const statusProgressProcent = await this.driver.findElement(
      By.css('.status-progress-percent')
    );
    if ((await statusProgressProcent.getText()) !== '90%') {
      throw new Error('Progress Status Procent must be 90%');
    }
    console.log(
      'Status was changed and now it:',
      await statusProgressProcent.getText()
    );
  }

  async changeStatusInProgressOnDone() {
    const selectStatus = await this.driver.findElement(
      By.id('areaStatusSelect')
    );
    const inputEl = this.driver.findElement(By.className('ng-input'));
    await this.driver.wait(until.elementIsEnabled(inputEl), 10000);
    await inputEl.click();
    await this.waitListDate('.ng-option-label', 1);
    const statusElements = this.driver.findElements(By.css('.ng-option-label'));
    await this.findDateInDropDown(await statusElements, 'Done');
    await this.notificationCheck();
    await this.checkAreaStatus('DONE');
  }

  async changeStatusDoneOnInProgress() {
    const inputEl = this.driver.findElement(By.className('ng-input'));
    await this.driver.wait(until.elementIsEnabled(inputEl), 10000);
    await inputEl.click();
    await this.waitListDate('.ng-option-label', 1);
    const statusElements = this.driver.findElements(By.css('.ng-option-label'));
    await this.findDateInDropDown(await statusElements, 'In Progress');
    await this.notificationCheck();
    await this.checkAreaStatus('IN_PROGRESS');
    const statusProgressProcent = await this.driver.findElement(
      By.css('.status-progress-percent')
    );
    if ((await statusProgressProcent.getText()) !== '100%') {
      throw new Error('Progress Status Procent must be 100%');
    }
    console.log(await statusProgressProcent.getText());
  }

  async changeStatusInProgressOnToDo() {
    const selectStatus = await this.driver.findElement(
      By.id('areaStatusSelect')
    );
    console.log(await selectStatus.getAttribute('value'));
    const inputEl = this.driver.findElement(By.className('ng-input'));
    await this.driver.wait(until.elementIsEnabled(inputEl), 10000);
    await inputEl.click();
    await this.waitListDate('.ng-option-label', 1);
    const statusElements = this.driver.findElements(By.css('.ng-option-label'));
    await this.findDateInDropDown(await statusElements, 'To Do');
    await this.notificationCheck();
    await this.checkAreaStatus('TO_DO');
  }

  async closeAreaPopUpAndCheckStatusInView() {
    const selectStatus = await this.driver.findElement(
      By.id('areaStatusSelect')
    );
    this.statusNow = await selectStatus.getAttribute('value');
    await this.closeAreaModalWindow();
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(By.css('.room-areas-list__item.ng-star-inserted')),
      10000
    );
    const areas = await this.driver.findElements(By.css("[areastatus='-3']"));
    const firstArea = await areas[0];
   
    if ((await firstArea.getAttribute('areastatus')) !== this.statusNow) {
      throw new Error('Close area Pop-up not work, check screenshot');
    }
    // console.log(await firstArea.getAttribute('areastatus'));
  }

  
  async closeAreaAndCheckProgress(properties = 'increase') {
    await this.closeAreaModalWindow();
    await this.driver.sleep(1000);
    const projectProgres = await this.driver.findElement(
      By.css('.project-status-wrapper span')
    );
    const beforeNumber = parseInt(this.progress, 10);
    const nowNumber = parseInt(await projectProgres.getText(), 10);
    console.log(beforeNumber, nowNumber);
    if (properties === 'increase') {
      if (beforeNumber >= nowNumber) {
        throw new Error('Progress not change, please check screenshot');
      }
    }
    else if(properties === 'equally'){
        if(beforeNumber !== nowNumber){
          throw new Error('Progress change, please check screenshot');
        }
    }
     else {
      if (beforeNumber <= nowNumber) {
        throw new Error('Progress not change, please check screenshot');
      }
    }
    this.progress = await projectProgres.getText();
    console.log("Project progress % test passed");
  }
  async comparisonOfProgress(properties = 'increase') {
    const projectProgres = await this.driver.findElement(
      By.css('.project-status-wrapper span')
    );
    const beforeNumber = parseInt(this.progress, 10);
    const nowNumber = parseInt(await projectProgres.getText(), 10);
    console.log(beforeNumber, nowNumber);
    if (properties === 'increase') {
      if (beforeNumber >= nowNumber) {
        throw new Error('Progress not change, please check screenshot');
      }
    }
    else if(properties === 'equally'){
        if(beforeNumber !== nowNumber){
          throw new Error('Progress change, please check screenshot');
        }
    }
     else {
      if (beforeNumber <= nowNumber) {
        throw new Error('Progress not change, please check screenshot');
      }
    }
    this.progress = await projectProgres.getText();
    console.log("Project progress % test passed");
  }
  async changeStatusOnCustomStatus(customyStatus) {
    const inputEl = this.driver.findElement(By.className('ng-input'));
    await this.driver.wait(until.elementIsEnabled(inputEl), 10000);
    await inputEl.click();
    await this.waitListDate('.ng-option-label', 1);
    const statusElements = this.driver.findElements(By.css('.ng-option-label'));
    await this.findDateInDropDown(await statusElements, customyStatus);
    await this.notificationCheck();
    await this.checkAreaStatus(customyStatus);
  }
}

module.exports = ChangeAreaStatus;
