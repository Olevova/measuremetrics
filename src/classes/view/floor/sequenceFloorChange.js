const {By, until} = require('selenium-webdriver');
const Base = require('../../base');


class SequenceFloorChange extends Base{

    constructor(driver){
        super(driver);
        this.driver=driver;
        this.firstElement = '';
        this.secondElement = '';
    }

   async sequenceChange(){
   
        await this.driver.wait(until.elementLocated(By.css('html')), 10000);
        await this.driver.executeScript('return document.readyState');
        const numberOfItems =await this.driver.wait(until.elementsLocated(By.css('.cdk-drag.floor-item')),10000);
        if(await numberOfItems === null){
            throw new Error('Insufficient quantity of items')
        };
        const floors = await this.driver.findElements(By.css('.cdk-drag.floor-item'));
        
        const draggable = await floors[0];
        const droppable = await floors[1];
        this.firstElement = await draggable.getText();
        this.secondElement = await droppable.getText();
        const start = await this.getCoordinates(droppable);
        console.log(start);
        const actions = this.driver.actions({ async: true });
        await this.driver.actions().move({ origin: draggable }).perform();
        await this.driver.actions().press().perform();
        await actions.move({x: Math.round(start.x), y: Math.round(start.y)}).pause(1000).perform();
        await actions.release().perform();
        await this.driver.sleep(1000);
        
    }
    async checkSequence(){
        const afterChange = await this.driver.findElements(By.css('.cdk-drag.floor-item'));
        if(await afterChange[0].getText() === this.secondElement && 
        await afterChange[1].getText()  === this.firstElement){
            console.log("Changing the floor sequence was successfully");
            return
        }
        throw new Error('Changing the floor sequence was failed')
    }
}

module.exports = SequenceFloorChange