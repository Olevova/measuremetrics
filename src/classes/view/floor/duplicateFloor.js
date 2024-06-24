const { By, until } = require('selenium-webdriver');
const CreatFloor = require('./createFloor');

class DuplicateFloor extends CreatFloor {
  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.duplicateFloorTitle = ''
    
  }

  async duplicateFloor(floor='default') {
    await this.driver.wait(
      until.elementsLocated(By.css('.cdk-drag.floor-item')),
      10000
    );
    const floors = await this.driver.findElements(
      By.css('.cdk-drag.floor-item')
    );
    const addFloorBtn = await this.driver.findElement(By.id('addFloor'))
    await this.driver.wait(until.elementIsEnabled(addFloorBtn), 10000);
    await addFloorBtn.click();
    await this.driver.wait(until.elementLocated(By.css('.add-floor-menu-with-btn-wrapper[opened]')),10000);
    await this.driver.sleep(2000);
    const duplicateBlock = await this.driver.wait(until.elementLocated(By.css('.duplicate-floor-variants-list')),3000).catch(()=>null);
    if (duplicateBlock===null){
      throw new Error('The project has no Floor for duplicate')

    }
    // const duplicateBlock = await this.driver.findElement(By.css('.duplicate-floor-variants-list'));
    const duplicateList = await duplicateBlock.findElements(By.css('.duplicate-floor-variants__item'))
    if(floor==='default'){
      await this.driver.wait(until.elementIsEnabled(duplicateList[0]),10000);
      this.duplicateFloorTitle = await duplicateList[0].getText() + " #2";
      await duplicateList[0].click();
      
    }
   
    else{
      this.duplicateFloorTitle = floor + " #2";
      this.findAndClickOnLinInTheList(floor,'.duplicate-floor-variants__item');

    }
    await this.notificationCheck();
    await this.checkCreateItem('.cdk-drag.floor-item', this.duplicateFloorTitle)
    console.log(this.duplicateFloorTitle, 'Duplicate floor title');
    return this.duplicateFloorTitle
  } 


}

module.exports = DuplicateFloor;