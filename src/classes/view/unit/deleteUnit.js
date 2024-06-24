const {By, until} = require('selenium-webdriver');
const Base = require('../../base');

class DeleteUnit extends Base{
    constructor(driver){

        super(driver);
        this.driver = driver;

    }
    async deleteUnit(unit){
        await this.driver.wait(until.elementsLocated(By.css('.unit-name-with-btn-wrapper')),10000);
        const units = await this.driver.findElements(By.css('.unit-name-with-btn-wrapper'));
        for (let item of units){
            let noBtn = false;
            if(item){
                const unitName = await item.findElement(By.css('.unit-name-wrapper p'));
                // console.log(await unitName.getText(), unit );
                if(await unitName.getText() === unit){
                    const menuBtn = await item.findElement(By.id('menuListAddRoomOpen'));
                    await this.driver.wait(until.elementIsEnabled(menuBtn),10000);
                    noBtn = true;
                    await menuBtn.click();
                    const menu = await this.driver.findElement(By.css('.editMenuList[editmenuunitopen]'))
                    
                    // await menu.wait(until.elementLocated(By.id('deleteUnitBtn')),10000);
                    const delUnitBtn = await menu.findElement(By.id('deleteUnitBtn'));
                    await this.driver.wait(until.elementIsEnabled(delUnitBtn),10000)
                    this.driver.sleep(1000)
                    await delUnitBtn.click();
                    break;
                    
                }
                  
            }
        }
          
        await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"]')),10000);
                    
        const modal = await this.driver.findElement(By.css('.backdrop[show="true"]'))
        const confirmDelBtn = await modal.findElement(By.id('btnDeleteProject'));
        await this.driver.sleep(2000);
        await this.driver.wait(until.elementIsEnabled(confirmDelBtn),10000);
        await confirmDelBtn.click();
    }

    async checkDeleteUnit(unit){
        await this.notificationCheck();
        await this.checkDeleteItem('.unit-name-wrapper p', unit)
    }
}

module.exports = DeleteUnit