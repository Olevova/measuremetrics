const {By, until} = require('selenium-webdriver');
const Base = require('../../base');

class SequenceRoomChange extends Base{
    async findeTwoItemForSequence(floors){
        for (let floor of floors){
            const areas = await floor.findElements(By.css('li .rooms-list__item'));
            if( await areas.length > 1){
                console.log('here');
                const draggable = await areas[0];
                const droppable = await areas[1];
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
                return

            }
            console.log('not here', await areas.length);
        }
        
    }
constructor(driver){
    super(driver);
    this.driver = driver

}

async sequenceRoomChange(){
await this.driver.wait(until.elementLocated(By.css('html')), 10000);
await this.driver.executeScript('return document.readyState');
await this.driver.sleep(2000)
const numberOfItems =await this.driver.wait(until.elementsLocated(By.css('.cdk-drag.floor-item')),10000);
        if(await numberOfItems === null){
            throw new Error('Insufficient quantity of items')
        };
        const floors = await this.driver.findElements(By.css('.cdk-drop-list.rooms-list'));
        await this.findeTwoItemForSequence(floors)
}

}

module.exports = SequenceRoomChange;