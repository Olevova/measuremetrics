const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class EditCustomStatus extends Base {
      
    constructor(driver){
        super(driver);
        this.driver = driver
    }

    async editCustomStatus (newstatus, color=2){
        await this.goToCustomStatusCreateForm();
        const newStatusList = await this.driver.findElement(
            By.css('ul.additional-statuses-list')
          );
        const statusInput = await newStatusList.findElement(
            By.css(".form-input-modal[placeholder='Status Name']")
          );
        await this.driver.wait(until.elementIsEnabled(statusInput));
        await statusInput.clear();
        await statusInput.sendKeys(newstatus);
        await newStatusList
      .findElement(By.css('.color-box-with-list-wrapper'))
      .click();
    await this.driver.wait(until.elementLocated(By.css('.colors-list')), 10000);
    const colorList = await this.driver.findElement(
      By.css('.colors-list'),
      10000
    );
    await this.driver.wait(until.elementIsEnabled(colorList));
    const customColors = await colorList.findElements(
      By.css('.colors-list__item')
    );
    await this.driver.sleep(1000);
    await customColors[color].click();
    

        await this.driver.sleep(1000);
        const submitBtn = await this.driver.findElement(By.id('btnSubmit'));
        await submitBtn.click();
    }

    async checkEditStatus(name){
        await this.notificationCheck();
        await this.checkCreateItem('.view-area-status__item', name + ' (0%)');
        await this.driver.sleep(1000);
    }

    
}

module.exports = EditCustomStatus;