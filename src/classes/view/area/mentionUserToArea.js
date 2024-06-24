const { By, until } = require('selenium-webdriver');
const Base = require('../../base');
const path = require('path');

class MentionUserToArea extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }

  async addUser(username) {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementsLocated(By.css('.room-areas-list__item.ng-star-inserted')),
      10000
    );
    const areas = await this.driver.findElements(
      By.css(`.room-areas-list__item.ng-star-inserted`)
    );
    await this.driver.wait(until.elementIsEnabled(areas[0]), 10000);
    await areas[0].click();
    await this.driver.wait(
      until.elementLocated(By.css('.ql-editor.ql-blank')),
      10000
    );
    const commentArea = await this.driver.findElement(
      By.css('.ql-editor.ql-blank')
    );
    await commentArea.click();
    this.driver.wait(until.elementLocated(By.css('.btn-save-comment')), 10000);
    const saveBtn = await this.driver.findElement(By.css('.btn-save-comment'));
    const userMeetBtn = await this.driver.findElement(By.css('.ql-formats'));
    await userMeetBtn.click();
    await this.driver.wait(
      until.elementLocated(By.id('quill-mention-list')),
      10000
    );
    const userList = await this.driver.findElement(By.id('quill-mention-list'));
    await this.driver.wait(until.elementIsVisible(userList), 1000);
    const user = await userList.findElement(By.id('quill-mention-item-0'));
    const users = await userList.findElements(By.css('p'));
    if(username){
     await this.findDateInDropDown(users, username)
    }
    else{
      await user.click();
    }
    await this.driver.wait(until.elementIsVisible(saveBtn), 10000);
    await saveBtn.click();
    await this.notificationCheck();
  }

  async goToUserList() {
    const allComments = await this.driver.findElements(
      By.css('.comments-list__item--inner')
    );
    const commentText = await allComments[0].findElement(By.css('p'));
    const userName = await commentText
      .findElement(By.css('span.mention'))
      .getAttribute('data-value');
    const linkUser = await commentText.findElement(By.css('span.mention'));
    console.log(userName);
    let areaNameWithMentionUser = await this.driver.findElement(By.css('.area-details-way.area-code'));
    const areaName = await areaNameWithMentionUser.getText()
    await linkUser.click();
    await this.driver.wait(
      until.elementLocated(By.css('.userName-settings-title')),
      10000
    );
    const userSettings = await this.driver.findElement(
      By.css('.userName-settings-title')
    );
    await this.driver.wait(until.elementIsVisible(userSettings), 10000);
    let userSettingsName = '';
    let counter;
    while (userSettingsName.length <= 0 || counter <= 3) {
      userSettingsName = await userSettings.getText();
      setTimeout(() => (counter += 1), 1000);
    }
    console.log(
      await userSettingsName.toLowerCase(),
      await userName.toLowerCase().trim(),
    );
    if (
      (await userName.toLowerCase().trim()) ===
      (await userSettingsName.toLowerCase().trim())
    ) {
      console.log('its user setting page, test run successful');
    } else {
      throw new Error('test fall');
    }
    return areaName
  }

  async deleteUserFromComment(commentsdel) {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementsLocated(By.css('.room-areas-list__item.ng-star-inserted')),
      10000
    );
    const areas = await this.driver.findElements(
      By.css(`.room-areas-list__item.ng-star-inserted`)
    );
    await this.driver.wait(until.elementIsEnabled(areas[0]), 10000);
    await areas[0].click();
    await this.driver.wait(
      until.elementLocated(By.css('.mention[data-denotation-char="@"]')),
      10000
    );
    const user = await this.driver.findElement(
      By.css('.mention[data-denotation-char="@"]')
    );
    await this.driver.wait(until.elementIsVisible(user), 10000);
    console.log(await user.getAttribute('data-value'), 'user');
    await this.driver.wait(
      until.elementLocated(By.css('.ql-editor.ql-blank')),
      10000
    );
    const allComments = await this.driver.findElements(
      By.css('.comments-list__item--inner')
    );
    const commentText = await allComments[0].findElement(
      By.css('.mention span[contenteditable="false"]')
    );
    const textOfComment = await commentText.getText();
    console.log(textOfComment, 'textOfComment', commentsdel);
    if (commentsdel !== textOfComment) {
      throw new Error("Can't find search element");
    }
    const editBtn = await allComments[0].findElement(
      By.id('menuListEditCommentOpen')
    );
    await editBtn.click();
    await this.driver.wait(
      until.elementLocated(By.css('.editMenuList[editmenucommentopen]'), 10000)
    );
    const commentMenu = await this.driver.findElement(
      By.css('.editMenuList[editmenucommentopen]')
    );
    await this.driver.wait(until.elementIsEnabled(commentMenu), 10000);
    await commentMenu.findElement(By.id('deleteUnitBtn')).click();
    await this.notificationCheck();
  }
}

module.exports = MentionUserToArea;
