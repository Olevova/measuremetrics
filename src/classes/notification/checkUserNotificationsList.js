const { By, until } = require('selenium-webdriver');
const Base = require('../base');


class CheckUserNotificationsList extends Base {

    async lastNotificationInSeconds(string){
        const arrayDate = string.split(' ');
    switch (arrayDate[1]) {
        case 'seconds':
            return Number(arrayDate[0]);
        case 'minutes':
            return Number(arrayDate[0]) * 60;
        default:
            throw new Error('No valid time unit specified in the notification');
    }
    }
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async goToNotificationList() {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementLocated(By.css('.notifications-btn')),10000)
    const notificationsMenuBtn = await this.driver.findElement(
      By.css('.notifications-btn')
    );
    await notificationsMenuBtn.click();

    await this.driver.wait(
      until.elementLocated(By.css('.notifications-list-wrapper[show="true"]')),
      1000
    );
  }
  
  async checkLastNotification(notificationtext) {
    await this.driver.wait(
      until.elementsLocated(By.css('.notifications-list__item')),
      10000
    );
    this.waitListDate('.notifications-list__item', 3)
    const allNotifications = await this.driver.findElements(
      By.css('.notifications-list__item')
    );
    const lastNotificatio = await allNotifications[0];
    const idOfItem = await lastNotificatio.findElement(By.css('.public-id'));
    const timeOfLastNotification = await lastNotificatio.findElement(By.css('.notif-info-time'));
    const second = await this.lastNotificationInSeconds(await timeOfLastNotification.getText()); 
    console.log(await idOfItem.getText(),await timeOfLastNotification.getText(), second);
    if(second<60 && await idOfItem.getText() === notificationtext){
        console.log('test notification passed successfully');
    }
    else{
        throw new Error('test notification failed')
    }

}
}

module.exports = CheckUserNotificationsList;
