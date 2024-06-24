const { By, until } = require('selenium-webdriver');
const Base = require('../../base');

class CreateUnit extends Base {
  async createForm(driver) {
    const firstUnitForm = await driver
      .wait(
        until.elementLocated(
          By.css('form.form-create-unit-instead-btn[openedunit="true"]')
        ),
        3000
      )
      .catch(() => null);
    if (firstUnitForm !== null) {
      const inputUnit = await firstUnitForm.findElement(
        By.id('createUnitInput')
      );
      await this.driver.wait(until.elementIsEnabled(inputUnit), 10000);
    } else {
      await this.driver.wait(
        until.elementLocated(By.id('createNewUnit')),
        10000
      );
      const createBtn = this.driver.findElement(By.id('createNewUnit'));
      await this.driver.wait(until.elementIsEnabled(createBtn), 10000);
      await createBtn.click();
    }
  }

  constructor(driver) {
    super(driver);
    this.driver = driver;
  }
// ++++++++++++++++++++++++++++++++++++++++=
async createUnitAndCheckMetrics(unit) {
  let startTime;
  let endTime;
  let openUnitAddForm;
  let openUnitInput;
  let createUnit;
  await this.driver.wait(until.elementLocated(By.css('html')), 10000);
  await this.driver.wait(until.elementsLocated(By.css('head style')), 10000);
  await this.driver.executeScript('return document.readyState');
  await this.driver.sleep(1000);
  await this.driver.wait(until.elementLocated(By.id('addUnit')), 10000);
  const addUnitBtn = await this.driver.findElement(By.id('addUnit'));
  await this.driver.wait(until.elementIsEnabled(addUnitBtn), 10000);
  await this.driver.actions().scroll(0, 0, 0, 0, addUnitBtn).perform();
  startTime = performance.now();
  await addUnitBtn.click();
  await this.driver.wait(until.elementLocated(By.css('#createNewUnit')),10000);
  endTime = performance.now();
  openUnitAddForm = endTime - startTime;
  startTime = performance.now();
  await this.createForm(this.driver);
  await this.driver.wait(
    until.elementLocated(By.id('createUnitInput')),
    10000
  );
  
  const unitInput = await this.driver.findElement(By.id('createUnitInput'));
  await unitInput.sendKeys(unit);
  endTime = performance.now();
  openUnitInput = endTime-startTime;
  startTime = performance.now()
  await this.driver.wait(until.elementLocated(By.id('createUnitBtn')), 10000);
  const submitBtn = await this.driver.findElement(By.id('createUnitBtn'));
  await this.driver.wait(until.elementIsEnabled(submitBtn), 10000);
  await submitBtn.click();
  await this.driver.sleep(1000);
  endTime = performance.now();
  createUnit = endTime - startTime;
  return{ 
    'open UnitAdd menu time': +openUnitAddForm.toFixed(2),
    'open Unit creation form time': +openUnitInput.toFixed(2),
    'time Unit creation form is closed and new Unit is appeared': +createUnit.toFixed(2)
  }
}
// ++++++++++++++++++++++++++++++++++++++++=
  async createUnit(unit) {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.wait(until.elementsLocated(By.css('head style')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    await this.driver.wait(until.elementLocated(By.id('addUnit')), 10000);
    const addUnitBtn = await this.driver.findElement(By.id('addUnit'));
    await this.driver.wait(until.elementIsEnabled(addUnitBtn), 10000);
    await this.driver.actions().scroll(0, 0, 0, 0, addUnitBtn).perform();
    await addUnitBtn.click();
    await this.createForm(this.driver);

    await this.driver.wait(
      until.elementLocated(By.id('createUnitInput')),
      10000
    );
    const unitInput = await this.driver.findElement(By.id('createUnitInput'));
    await unitInput.sendKeys(unit);
    await this.driver.wait(until.elementLocated(By.id('createUnitBtn')), 10000);
    const submitBtn = await this.driver.findElement(By.id('createUnitBtn'));
    await this.driver.wait(until.elementIsEnabled(submitBtn), 10000);
    await submitBtn.click();
  }

  async checkCreateUnit(unit) {
    await this.driver.sleep(1000);
    await this.checkCreateItem('.unit-name-wrapper p', unit);
  }
}

module.exports = CreateUnit;
