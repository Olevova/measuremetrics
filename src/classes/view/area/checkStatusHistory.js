const { By, until } = require('selenium-webdriver');
const Base = require('../../base');

class CheckHistoryStatus extends Base{

    dateCreater(dataString, time){
        const dateArray  = dataString.split(/[\s,:]+/);
        const monthNames = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const month = monthNames[dateArray[0]];
        const day = parseInt(dateArray[1]);
        const year = parseInt(dateArray[2]);
        let hour = parseInt(dateArray[3]);
        const minute = parseInt(dateArray[4]);
        
        if (hour === 12 && dateArray[5] === 'AM') {
            hour = 0;
        } else if (hour !== 12 && dateArray[5] === 'PM') {
            hour += 12;
        }
        
        const date = new Date(year, month, day, hour, minute);
        if((time-date)/(1000 * 60) <= 2){
            console.log((time-date)/(1000 * 60));
            return true
        }
        console.log((time-date)/(1000 * 60));
        false
    }

    constructor(driver){
        super(driver);
        this.driver = driver;
        this.changingTime=null
    }
    async checkHistory(status){
        await this.driver.wait(until.elementLocated(By.css('html')), 10000);
        await this.driver.executeScript('return document.readyState');
        this.changingTime =new Date();
        await this.findAndClickOnLinInTheList('History','.area-details-tabs-list__link');
        await this.waitListDate('.top-line', 1);
        const historyInform = await this.driver.findElements(By.css('.top-line'));
        const time = await historyInform[0].findElement(By.css('.timestamp')).getText();
        const areaStatus = await this.driver.findElement(By.css('.changes p')).getText();
        console.log(time,'time', this.changingTime);
        if(!this.dateCreater(time, this.changingTime) || status.toLowerCase() !== await areaStatus.toLowerCase() ){
                throw new Error ('History not work')
        }
        console.log("History works");
        await this.driver.sleep(1000)
    }
}


module.exports = CheckHistoryStatus;