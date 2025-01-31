const { By, until } = require('selenium-webdriver');
const ChangeAreaStatus = require('./changeAreaStatusInView');


class ChangeAreaStatusInProjectProgress extends ChangeAreaStatus{

    constructor(driver){
        super(driver);
        this.driver = driver;
        this.statusNow='';
        this.selectStatusName = '';
    }

    // +++++++++++++++++++++++++++++++++++++++++++++=
    async findeAreaStatusClickAndMeasureMetric(status = '-3') {
        let startTime;
        let endTime;
        let openAreaDetailPopUp;
        let waitForArea

        startTime = performance.now();
        await this.driver.wait(until.elementLocated(By.css('html')), 10000);
        await this.driver.executeScript('return document.readyState');
        await this.driver.wait(until.elementsLocated(By.css(`.area-progress-list-areas__item[status-name="To Do"]`)), 20000);
        endTime = performance.now();
        waitForArea = endTime-startTime;
        console.log(waitForArea, 'waitForArea');
        const areaElement = await this.driver.findElement(By.css(`.area-progress-list-areas__item[status-name="To Do"]`));
    
        startTime = performance.now();
        await areaElement.click();
        // const nextPaintPromise = this.driver.executeAsyncScript(`
        //     const callback = arguments[arguments.length - 1];
        //     const observer = new PerformanceObserver((list) => {
        //         const entries = list.getEntries();
        //         const lastEntry = entries[entries.length - 1];
        //         observer.disconnect();
        //         callback(lastEntry.startTime);
        //     });
        //     observer.observe({ entryTypes: ['paint'] });
        //     requestAnimationFrame(() => {
        //         requestAnimationFrame(() => {});
        //     });
        // `);

        await this.driver.wait(until.elementLocated(By.css('.area__status-btn')), 10000);
        const selectStatusMenu = await this.driver.findElement(By.css('.area__status-btn'));
        await this.driver.wait(until.elementIsEnabled(selectStatusMenu),10000);
        endTime = performance.now();
        openAreaDetailPopUp = endTime - startTime;
        await this.driver.sleep(1000);
        // const { startTime: browserStartTime, inpEndTime } = await nextPaintPromise;
        // const inp = inpEndTime - browserStartTime;
        // console.log(inp, "inp");
        return {
            'Open area ditails Pop Up time': +openAreaDetailPopUp.toFixed(2),
            'Time areas appear on the "Project Progress" tab': +waitForArea.toFixed(2)
        }
    }

    // +++++++++++++++++++++++++++++++++++++++++++++=

    async findeAreaInTheTable(status = '-3') {
        await this.driver.wait(until.elementLocated(By.css('html')), 10000);
        await this.driver.executeScript('return document.readyState');
        await this.driver.wait(until.elementsLocated(By.css(`.area-progress-list-areas__item[status-name="To Do"]`)), 10000);
        const areaElements = await this.driver.findElements(By.css(`.area-progress-list-areas__item[status-name="To Do"]`));
    
        if (areaElements.length === 0) {
            throw new Error('It has no area with status To Do');
        }
        for(let i of areaElements){
            const stEl = await i.getAttribute('status');
        }
        const firstArea = areaElements[0];
    
        console.log(await firstArea.getAttribute('status'), await firstArea.getAttribute('area-name'));
        this.selectStatusName = await firstArea.getAttribute('area-name');
        await firstArea.click();
    
        await this.driver.wait(until.elementLocated(By.id('areaStatusSelect')), 10000);
    
        await this.driver.sleep(2000);
    }

    async closeAreaPopUpAndCheckStatusInPogress(status='-3'){
        const selectStatus = await this.driver.findElement(By.id('areaStatusSelect'));
        this.statusNow = await selectStatus.getAttribute('value');
        const popUp = await this.driver.findElement(By.css('.backdrop[show="true"]'))
        const closeBtn = await popUp.findElement(By.id('btnCloseModal'));
        await this.driver.wait(until.elementIsEnabled(closeBtn),10000);
        await closeBtn.click()
        await this.driver.wait(until.elementLocated(By.css('html')), 10000);
        await this.driver.executeScript('return document.readyState');
        await this.driver.wait(until.elementsLocated(By.css(`.area-progress-list-areas__item[status="${status}"]`)),10000);
        const areaElements = await this.driver.findElements(By.css(`.area-progress-list-areas__item[status="${status}"]`))
        const firstArea = await areaElements[0];
        if(await firstArea.getAttribute('status') !== this.statusNow && await firstArea.getAttribute('area-name') !== this.selectStatusName){
            throw new Error('Close area Pop-up not work, check screenshot')
        }

    }

}

module.exports = ChangeAreaStatusInProjectProgress