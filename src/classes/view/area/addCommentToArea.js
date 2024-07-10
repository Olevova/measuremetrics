const { By, until } = require('selenium-webdriver');
const Base = require('../../base');
const path = require('path');

class AddCommentToArea extends Base {
  constructor(driver) {
    super(driver);
    this.driver = driver;
  }
//++++++++++++++++++++++++++++++++++++++++++++++++=
async addCommentMeasureMetrics(comment) {
  let startTime
  let endTime;
  let saveComments;

  await this.driver.wait(
    until.elementLocated(By.css('.ql-editor.ql-blank')),
    10000
  );
  const commentArea = await this.driver.findElement(
    By.css('.ql-editor.ql-blank')
  );
  startTime = performance.now();
  await commentArea.click();
  this.driver.wait(until.elementLocated(By.css('.btn-save-comment')), 10000);
  const saveBtn = await this.driver.findElement(By.css('.btn-save-comment'));
  await commentArea.sendKeys(comment);
  await this.driver.wait(until.elementIsVisible(saveBtn), 10000);
  await saveBtn.click();
  await this.driver.wait(until.elementIsNotVisible(saveBtn),10000);
  endTime = performance.now();
  saveComments = endTime -startTime;
  await this.driver.wait(until.elementLocated(By.css('app-notification')),10000);
  // await this.driver.wait(until.elementLocated(By.css('.notification')),10000);
  // await this.notificationCheck();
  await this.driver.sleep(2000);
  return {'save area comment time': +saveComments.toFixed(2)}
}
//++++++++++++++++++++++++++++++++++++++++++++++++=



  async addComment(comment) {
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
    await commentArea.sendKeys(comment);
    await this.driver.wait(until.elementIsVisible(saveBtn), 10000);
    await saveBtn.click();
    await this.notificationCheck();
    await this.driver.sleep(2000);
  }
  async editComment(oldcomment, newcomment) {
    const allComments = await this.driver.findElements(
      By.css('.comments-list__item--inner')
    );
    const commentText = await allComments[0].findElement(By.css('p'));
    const textOfComment = await commentText.getText();
    if (oldcomment !== textOfComment) {
      throw new Error("Can't find your for edit");
    }
    console.log(await textOfComment);
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
    await commentMenu.findElement(By.id('editUnitBtn')).click();
    await this.driver.wait(
      until.elementLocated(By.css('.ql-editor[contenteditable="true"] p')),
      10000
    );
    await this.driver.sleep(1000);
    const commentInput = await this.driver.findElements(
      By.css('.ql-editor[contenteditable="true"]')
    );
    await commentInput[1].clear();
    await commentInput[1].sendKeys(newcomment);
    const activeEditForm = await this.driver.findElement(
      By.css('.editorWrapper[open="true"]')
    );
    const saveBtn = await activeEditForm.findElement(
      By.css('.btn-save-comment')
    );
    await saveBtn.click();
    await this.notificationCheck();
  }
  async deleteComment(commentsdel) {
    const allComments = await this.driver.findElements(
      By.css('.comments-list__item--inner')
    );
    const commentText = await allComments[0].findElement(By.css('p'));
    const textOfComment = await commentText.getText();
    if (commentsdel !== textOfComment) {
      throw new Error("Can't find your for del");
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
    await this.driver.wait(until.elementLocated(By.css('app-notification')),10000);
    // await this.driver.wait(until.elementLocated(By.css('.notification')),10000);
    // await this.notificationCheck();
  }
}

module.exports = AddCommentToArea;
