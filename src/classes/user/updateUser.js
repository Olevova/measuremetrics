const { By, until } = require('selenium-webdriver');
const Base = require('../base');

class UpdateUsaer extends Base {

    static async nameChange(userName, user){
        if(userName === user){
            return user+'1'
        }

        else{
            return user
        }
    };

    static async compareAnswer(profileName, menuName){
        if(profileName === menuName){
            return console.log("Updated successfully");
        };
        throw new Error ('Updated not success')
    }

    constructor(driver){
        super(driver);
        this.driver = driver;
        this.inputName=''
    }

    async openUserForm(){

        const userMenu = await this.driver.findElement(By.id('profileUserBtn'));
        await userMenu.click();
        await this.driver.wait(until.elementLocated(By.id('myProfileLink')),10000);
        const profileBtn = this.driver.findElement(By.id('myProfileLink'));
        await this.driver.wait(until.elementIsEnabled(profileBtn),10000);
        await profileBtn.click();

        const goToFormEditBtn = await this.driver.findElement(By.id('btnEdit'));
        await this.driver.wait(until.elementIsEnabled(goToFormEditBtn));

        await goToFormEditBtn.click();
        await this.driver.sleep(1000)
        await this.driver.wait(until.elementLocated(By.id('userName'),10000));
        const nameInput = this.driver.findElement(By.id('userName'));
        
        this.inputName = await nameInput.getAttribute('value');


    };

    async updateAndCheck(user){
        const newName = await UpdateUsaer.nameChange(this.inputName, user);
        const nameInput = this.driver.findElement(By.id('userName'));
        await nameInput.clear();
        await nameInput.sendKeys(newName);
        const submitBtn = this.driver.findElement(By.id('btnSave'))
        await this.driver.wait(until.elementIsEnabled(submitBtn));
        await submitBtn.click();
        // await this.driver.sleep(3000);
      
        await this.driver.wait(until.elementLocated( By.className('notification')), 10000);
       
        const windowHandles = await this.driver.findElement(
            By.className('notification')
          );
          await this.driver.wait(
            until.stalenessOf(windowHandles),
            10000
          );
     
        const userMenuBtn = await this.driver.findElement(By.id('profileUserBtn'))
        const userMenuName = await userMenuBtn.getText()

        await UpdateUsaer.compareAnswer(userMenuName, newName);

    } 

};


module.exports = UpdateUsaer;