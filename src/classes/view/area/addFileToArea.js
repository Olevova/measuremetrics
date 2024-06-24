const { By, until } = require('selenium-webdriver');
const Base = require('../../base');
const fs = require('fs');
const path = require('path');

class AddFileToArea extends Base{

    // async findLogoPath() {
    //     // Search Logo.png in dir /app
    //     const logoPath = await this.findFileRecursively('/app', 'Logo.png');
    //     console.log("Current working directory:", __dirname);
    //     console.log("Files in current directory:", fs.readdirSync(__dirname));
    //     console.log(logoPath, 'find here');
    //     return logoPath;
    // }


    // async findFileRecursively(directory, filename) {
    //     const files = fs.readdirSync(directory);
    //     for (const file of files) {
    //         const filePath = path.join(directory, file);
    //         const stat = fs.statSync(filePath);
    //         if (stat.isDirectory()) {
    //             const foundFile = await this.findFileRecursively(filePath, filename);
    //             if (foundFile) {
    //                 return foundFile;
    //             }
    //         } else if (file === filename) {
    //             return filePath;
    //         }
    //     }
    //     return null;
    // }


    constructor(driver){
        super(driver);
        this.driver = driver;
        // this.areaName = null;
    }

   async addFile(comment){
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000)
    console.log(__dirname, 'dirName');
    await this.driver.wait(until.elementsLocated(By.css('.room-areas-list__item.ng-star-inserted')), 10000);
    const areas = await this.driver.findElements(By.css(`.room-areas-list__item.ng-star-inserted`));
    await this.driver.wait(until.elementIsEnabled(areas[0]),10000)
    // await this.driver.sleep(1000)

    await areas[0].click();
    await this.driver.wait(until.elementLocated(By.css('.ql-editor.ql-blank')),10000);
    const commentArea = await this.driver.findElement(By.css('.ql-editor.ql-blank'));
    await commentArea.click();
    this.driver.wait(until.elementLocated(By.css('.btn-save-comment')),10000);
    const saveBtn = await this.driver.findElement(By.css('.btn-save-comment'));
    await commentArea.sendKeys(comment);
    // add file
    const inputFile = await this.driver.findElement(By.id('fileInput'));
    
    // for local Use
    // const pathFile = path.join(__dirname, 'Logo.png');
    // await inputFile.sendKeys(pathFile)
    // for local Use

    // for Docker Use
    await inputFile.sendKeys("/external_jars/.classpath.txt") 
    // for Docker Use_classpath-1.txt
    await this.driver.sleep(10000);
    await this.driver.wait(until.elementIsVisible(saveBtn),10000);
    await saveBtn.click();
    await this.notificationCheck();
    }

    async checkAttachment(filename, state){
        await this.driver.wait(until.elementLocated(By.css('html')), 10000);
        await this.driver.executeScript('return document.readyState');
        await this.findAndClickOnLinInTheList('Files','.area-details-tabs-list__link');
        const imgArray =  await this.driver.wait(until.elementsLocated(By.css('.file-item a')),10000).catch(()=>null);
        if(imgArray === null && state !== 'add'){
            console.log('attachment was deleted');
            return
        }
        else if(imgArray === null && state === 'add'){
            throw new Error('The attachment was not add')
        };
        const attacheImg = await this.driver.findElement(By.css('.file-item a'));
        const fileSrc = await attacheImg.getAttribute('href');
        // console.log(fileSrc, 'fileSrc', filename);
        const fileNameArray = await fileSrc.split('/');
        const fileNameAdd = await fileNameArray[fileNameArray.length-1]
        console.log(await fileNameAdd, "file for check");
        if(state === 'add'){
            // console.log(filename.toLowerCase() !== await fileNameAdd.toLowerCase(), filename.toLowerCase(), );
        if(filename.toLowerCase() !== await fileNameAdd.toLowerCase()){
            throw new Error('file did not added')
        }
        console.log('file was added');
        }
        else{
            if(filename.toLowerCase() === await fileNameAdd.toLowerCase()){
                throw new Error('file did not delete')
            }
            console.log('file was deleted');
        }
        await this.findAndClickOnLinInTheList('Activity','.area-details-tabs-list__link');
    }
    
}

module.exports = AddFileToArea;