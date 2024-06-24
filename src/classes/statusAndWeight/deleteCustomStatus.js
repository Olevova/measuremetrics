const { By, until } = require('selenium-webdriver');
const Base = require('../base');
const { addAbortListener } = require('node-imap');

class DeleteCustomStatus extends Base {
      
    constructor(driver){
        super(driver);
        this.driver = driver
    }

    async deleteCustomStatus (){
        await this.goToCustomStatusCreateForm();
        await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"] .form-invite.form-create')),10000);
        await this.driver.wait(until.elementLocated(By.css("ul.additional-statuses-list")),10000);
        const newStatusList = await this.driver.findElement(By.css("ul.additional-statuses-list"));
        const deleteBtn = await newStatusList.findElement(By.id("deleteStatusField"));
        await this.driver.wait(until.elementIsEnabled(deleteBtn));
        await deleteBtn.click();
        await this.driver.sleep(1000);
        const submitBtn = await this.driver.findElement(By.id('btnSubmit'));
        await submitBtn.click();
    }

    async checkDeleteStatus(name){
        await this.notificationCheck();
        await this.checkDeleteItem('.view-area-status__item', name+" (0%)")
        await this.driver.sleep(2000);
    }

    async inabilityToDeleteStatus(){
        await this.goToCustomStatusCreateForm();
        await this.driver.wait(until.elementLocated(By.css('.backdrop[show="true"] .form-invite.form-create')),10000);
        await this.driver.wait(until.elementLocated(By.css("ul.additional-statuses-list")),10000);
        const newStatusList = await this.driver.findElement(By.css("ul.additional-statuses-list"));
        const formHasDeleBtn = await this.driver.wait(until.elementLocated(By.id("deleteStatusField")),2000).catch(()=>null);
        if(formHasDeleBtn){
            throw new Error('You can delete custom status, test failed');
        }
        else{
            console.log("passed, you can not delete custom status");
            const cancelBtn = await this.driver.findElement(By.id('btnCancel'));
            await cancelBtn.click();

        }
    }
    
}

module.exports = DeleteCustomStatus