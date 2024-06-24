const { By, until } = require('selenium-webdriver');
const path = require('path');



class Base {
  // The method used for finding values in dropdown menus in forms.
  async findDateInDropDown(array, text) {
    for (const option of array) {
      const date = (await option.getText()).trim().toLowerCase();
      // console.log(date, text);

      if (date === text.trim().toLowerCase()) {
        // console.log('here in f');
        await option.click();
        return;
      }
    }

    throw Error(`No ${text} in options list`);
  }

  async numberOfItemsInTheList(locator, number='100', listLocator = '.company-name' ) {
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementsLocated(By.css(locator)), 10000);

    let element;
    let counter = 0;

    while (!element || element.length < 2) {
      element = await this.driver.findElements(By.css(locator));

      if (element.length < 1) {
        await this.driver.sleep(1000);
      }
      counter += 1;
      if (counter >= 5) {
        break;
      }
    }
    const listOfItem = await this.driver.findElements(By.css(locator));
    let len;
    // console.log(await listOfItem.length, "list len");
    if ((await listOfItem.length) >= 20) {
      const noPagination = await this.driver
      .wait(until.elementLocated(By.id('selectAmountItems')), 3000)
      .catch(() => null);

    if (noPagination === null) {
      const emptyList = 20;
      return emptyList;
    }
    const paginationDropDown = await this.driver.findElement(
        By.id('selectAmountItems')
      );

      await this.driver
        .actions()
        .scroll(0, 0, 0, 0, paginationDropDown)
        .perform();

      const totalEl = await this.driver
        .findElement(By.className('total-item-text'))
        .getText();
      const numberEl = totalEl.split(' ');
      const len = Number(numberEl[numberEl.length - 1]);
      await paginationDropDown.click();
      const paginationList = await this.driver.findElements(
        By.className('ng-option')
      );
      await this.findDateInDropDown(paginationList, number);
      await this.waitListDate(listLocator, 21);
      const dataInList = await this.driver.findElements(By.css(listLocator));
      // console.log(len, await dataInList.length , 'lenght');
      if(len === await dataInList.length){
        return len;
      }
      else {
        throw new Error(`The number of items in the list does not match the number of items in the counter`);
      }
    }
    len = await listOfItem.length;
    return len;
  }

  // The method that returns the number of items in a list can be used to search for the count of projects, companies, etc
  async numberOfItems(driver) {
    await driver.executeScript('return document.readyState');

    const noPagination = await this.driver
      .wait(until.elementLocated(By.id('selectAmountItems')), 3000)
      .catch(() => null);

    if (noPagination === null) {
      const emptyList = 0;
      return emptyList;
    }

    const paginationDropDown = await driver.findElement(
      By.id('selectAmountItems')
    );

    await driver.actions().scroll(0, 0, 0, 0, paginationDropDown).perform();

    const totalEl = await driver
      .findElement(By.className('total-item-text'))
      .getText();
    const numberEl = totalEl.split(' ');
    const numberOfItems = Number(numberEl[numberEl.length - 1]);

    // console.log(numberOfItems);
    return numberOfItems;
  }

  // The method that expects an array whose length is greater than a certain number, which can be specified as a parameter
  async waitListDate(selector, lngh) {
    let element;
    let counter = 0;

    while (!element || element.length < 2) {
      element = await this.driver.findElements(By.css(selector)); // Use the provided selector

      if (element.length < lngh) {
        console.log(element.length, 'lenght');
        await this.driver.sleep(1000);
      }
      counter += 1;
      if (counter >= 10) {
        break;
      }
    }
  }

  // The method that waits for a certain period of time and continues executing a function during that time
  async waitForSpecificTime(hour, minute) {
    const now = new Date();
    const targetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0,
      0
    );

    const timeDifference = targetTime - now;
    if (timeDifference > 0) {
      console.log(now);
      return new Promise(resolve => setTimeout(resolve, timeDifference));
    }
  }
  //The method for switching to a tab view and check metrics++++++++++++++++++++++++++++++++++++++++++++++++++
  async goToViewAndCheckMetrics(project = null, user = 'sa') {
    let startTime;
    let endTime;
    let projectDetailsPageOpen;
    if (user === 'sa') {
      await this.driver.wait(
        until.elementLocated(By.id('linkProjects')),
        10000
      );
      const projectLink = await this.driver.findElement(By.id('linkProjects'));
      await this.driver.wait(until.elementIsEnabled(projectLink), 10000);
      await this.driver.sleep(1000);
      await projectLink.click();
    } else {
      await this.driver.wait(
        until.elementLocated(By.id('linkProjectsAdminOrEmployee')),
        10000
      );
      const projectLinkForAnotherUsers = await this.driver.findElement(
        By.id('linkProjectsAdminOrEmployee')
      );
      await this.driver.wait(
        until.elementIsEnabled(projectLinkForAnotherUsers),
        10000
      );
      await this.driver.sleep(1000);
      await projectLinkForAnotherUsers.click();
      await this.driver.sleep(1000);
    }

    await this.driver.wait(
      until.elementsLocated(By.css('.company-name')),
      10000
    );
    const listItem = await this.driver.findElements(By.css('.company-name'));
    let firstProjectLink;
    if(await listItem.length >= 20){
      const pagination = await this.driver.wait(until.elementLocated(By.id('paginationWrapper')),3000);
      if(pagination){
        await this.selectNumberOfItemsPerPagination('100');
      }
      firstProjectLink = await this.driver.findElements(
        By.css('.company-name')
      );
    }else
    {
      firstProjectLink = await this.driver.findElements(
        By.css('.company-name')
      );
    }
    if (project) {
      await this.findAndClickOnLinkInTheList(project, '.company-name');
      startTime = performance.now();
      await this.driver.wait(until.elementLocated(By.css('.floors-wrapper')),10000)
      await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('.floors-wrapper'))), 10000);
      await this.driver.wait(until.elementLocated(By.css('#unitListId')),10000)
      await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('#unitListId'))), 10000);
      endTime = performance.now();
      projectDetailsPageOpen = endTime - startTime
      console.log(projectDetailsPageOpen);
      return {'time to open project page': +projectDetailsPageOpen.toFixed(2)}
    } else {
      await firstProjectLink[0].click();
      startTime = performance.now();
      await this.driver.wait(until.elementLocated(By.css('.floors-wrapper')),10000)
      await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('.floors-wrapper'))), 10000);
      await this.driver.wait(until.elementLocated(By.css('#unitListId')),10000)
      await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.css('#unitListId'))), 10000);
      endTime = performance.now();
      projectDetailsPageOpen = endTime - startTime
      console.log(projectDetailsPageOpen);
      return {'time to open project page': +projectDetailsPageOpen.toFixed(2)}
      // await this.driver.sleep(1000);
    }
  }
  // The method for switching to a tab view.+++++++++++++++++++++++++++++++++++++++++++++++++++++
  async goToView(project = null, user = 'sa') {
    if (user === 'sa') {
      await this.driver.wait(
        until.elementLocated(By.id('linkProjects')),
        10000
      );
      const projectLink = await this.driver.findElement(By.id('linkProjects'));
      await this.driver.wait(until.elementIsEnabled(projectLink), 10000);
      await this.driver.sleep(1000);
      await projectLink.click();
    } else {
      await this.driver.wait(
        until.elementLocated(By.id('linkProjectsAdminOrEmployee')),
        10000
      );
      const projectLinkForAnotherUsers = await this.driver.findElement(
        By.id('linkProjectsAdminOrEmployee')
      );
      await this.driver.wait(
        until.elementIsEnabled(projectLinkForAnotherUsers),
        10000
      );
      await this.driver.sleep(1000);
      await projectLinkForAnotherUsers.click();
      await this.driver.sleep(1000);
    }

    await this.driver.wait(
      until.elementsLocated(By.css('.company-name')),
      10000
    );
    const listItem = await this.driver.findElements(By.css('.company-name'));
    let firstProjectLink;
    if(await listItem.length >= 20){
      const pagination = await this.driver.wait(until.elementLocated(By.id('paginationWrapper')),3000);
      if(pagination){
        await this.selectNumberOfItemsPerPagination('100');
      }
      firstProjectLink = await this.driver.findElements(
        By.css('.company-name')
      );
    }else
    {
      firstProjectLink = await this.driver.findElements(
        By.css('.company-name')
      );
    }
    if (project) {
      await this.findAndClickOnLinkInTheList(project, '.company-name');
      await this.driver.sleep(1000);
    } else {
      await firstProjectLink[0].click();
      await this.driver.sleep(1000);
    }
  }

  // The method for navigating to a specified tab.
  async goToSelektTab(tabname) {
    await this.driver.wait(
      until.elementsLocated(By.css('.tab-list__item')),
      10000
    );
    const tabElements = await this.driver.findElements(
      By.css('.tab-list__item')
    );
    let trigger = false;
    for (const tab of tabElements) {
      let tabEl = await tab.getText();
      tabEl = tabEl.toLowerCase().trim();
      if (tabEl === tabname.toLowerCase()) {
        await tab.click();
        await this.driver.sleep(500);
        trigger = true;
        return;
      }
    }
    if (!trigger) {
      throw new Error(`It is not tab with name ${tabname}`);
    }
  }

  // The method for searching for a created element and checking its presence in the list
  async checkCreateItem(locator, item) {
    const units = await this.driver.findElements(By.css(locator));
    let isItemCreated = false;
    for (let i of units) {
      if (i) {
        const itemText = await i.getText();
        // console.log(itemText, item , 'check')
        if (itemText.trim() === item) {
          console.log(`${item} is created successfully`);
          isItemCreated = true;
          break;
        }
      }
    }
    if (!isItemCreated) {
      console.log(`${item} is not created`);
      throw new Error(`${item} is not created`);
    }
  }

  // The method that checks for the removal of an element from the list
  async checkDeleteItem(locator, item) {
    const units = await this.driver.findElements(By.css(locator));
    let isItemCreated = false;

    for (let i of units) {
      if (i) {
        const itemText = await i.getText();
        if (itemText.trim() === item) {
          console.log(`${item} is not deleted`);
          throw new Error(`${item} is not deleted`);
        }
      }
    }

    if (!isItemCreated) {
      console.log(`Item ${item} is deleted successfully`);
    }
  }

  // The method for checking notifications after a successful action on the website
  async notificationCheck(
    locator = 'className',
    selector = 'small-error-text-field'
  ) {
    const formError = await this.driver
      .wait(until.elementLocated(By[locator](selector)), 500)
      .catch(() => null);
    if (formError) {
      console.log(
        await formError.getText(),
        'text',
        await formError.getAttribute('id')
      );
      console.log('Error element exists:', formError);
      throw new Error('You have error, check screenshot');
    }
    await this.driver.wait(
      until.elementLocated(By.className('notification')),
      10000
    );
    const windowHandles = await this.driver.findElement(
      By.className('notification')
    );
    await this.driver.wait(until.elementIsVisible(windowHandles), 10000);

    const windowHandlesText = await windowHandles.getText();

    if (windowHandlesText === 'Error. Failed to save data') {
      throw new Error('Item did not create');
    }
    await this.driver.wait(until.stalenessOf(windowHandles), 10000);
  }

  // The method for locating the coordinates of an element on the website
  async getCoordinates(element) {
    const rect = await element.getRect();
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;
    return { x, y };
  }

  // The method for checking the status of an array
  async checkAreaStatus(status) {
    const newSelectStatus = await this.driver.findElement(
      By.id('areaStatusSelect')
    );
    if ((await newSelectStatus.getAttribute('value')) == !status) {
      throw new Error(
        `The area's status does not match the specified status of ${status}`
      );
    }
    console.log(` All ok status is ${status}`);
  }

  // The method for finding a link in a list and clicking on it
  async findAndClickOnLinkInTheList(link, selector) {
    const listOfLink = await this.driver.findElements(By.css(selector));
    let notFindeLink = true;
    for (let linkTag of listOfLink) {
      const linkText = await linkTag.getText();
      // console.log(linkText);
      if ((await linkText.toLowerCase().trim()) === link.toLowerCase()) {
        await linkTag.click();
        notFindeLink = false;
        break;
      }
    }
    if (notFindeLink) {
      throw new Error('It is not such link');
    }
  }

  // The method for navigating to the form for creating a custom status
  async goToCustomStatusCreateForm() {
    await this.driver.wait(
      until.elementLocated(By.css('.customize-status-btn')),
      10000
    );
    const statusBtn = this.driver.findElement(By.css('.customize-status-btn'));
    await this.driver.wait(until.elementIsEnabled(statusBtn), 10000);
    await statusBtn.click();
    await this.driver.wait(
      until.elementLocated(By.css('.customize-menu[open="true"]')),
      10000
    );
    const cunstomizeStatus = await this.driver.findElements(
      By.css('.customize-menu__item')
    );
    await this.driver.wait(until.elementIsEnabled(cunstomizeStatus[0]), 10000);
    await this.driver.sleep(1000);
    await cunstomizeStatus[0].click();
    await this.driver.wait(
      until.elementLocated(
        By.css('.backdrop[show="true"] .form-invite.form-create')
      ),
      10000
    );
  }

  // The method for closing the modal window of an area.
  async closeAreaModalWindow() {
    await this.driver.wait(until.elementLocated(By.id('btnCloseModal')), 10000);
    const popUp = await this.driver.findElement(
      By.css('.backdrop[show="true"]')
    );
    const closeBtn = await popUp.findElement(By.id('btnCloseModal'));
    await this.driver.wait(until.elementIsEnabled(closeBtn), 10000);
    await closeBtn.click();
  }

  // The method that can be used to change the window size. If we need
  async makeWindowsFormLower(size) {
    await this.driver.executeScript(`document.body.style.zoom='${size}%'`);
  }

  // For local use return path to the file that can be used for attachment to an issue or task
  fileReturn() {
    const currentDirectory = __dirname;
    console.log(currentDirectory, 'currentDirectory');
    const imagePath = path.join(currentDirectory, 'utils/Logo.png');
    return imagePath;
  }

  // find item in list and open three dot menu
  async findItemAndOpenThreeDotsMenu(item, selector) {
    const listOfItem = await this.driver.findElements(By.css(selector));
    for (const [index, task] of listOfItem.entries()) {
      // console.log(await task.getText(), index);
      if (item === (await task.getText())) {
        // console.log(index, 'index');
        const dotsMenuList = await this.driver.findElements(
          By.css('.dots-actions')
        );
        const menuForClick = await dotsMenuList[index];
        await this.driver.wait(until.elementIsEnabled(menuForClick), 10000);
        await menuForClick.click();
        await this.driver.sleep(1000);
      }
    }
  }
  // Method for navigating through dashboard tabs.
  async goToDashboardTab(tabName) {
    await this.driver.executeScript('return document.readyState');
    await this.driver.sleep(1000);
    await this.driver.wait(
      until.elementsLocated(By.css('.nav-list__item')),
      10000
    );
    const listOfTabs = await this.driver.findElements(
      By.css('.nav-list__item')
    );
    for (let tab of listOfTabs) {
      let tabForCheck = await tab.findElement(By.css('a')).getText();
      // console.log(tabForCheck, tabName);
      if ((await tabForCheck.trim().toLowerCase()) === tabName.toLowerCase()) {
        // console.log(tabForCheck, tabName);
        await tab.click();
        await this.driver.wait(
          until.elementLocated(By.css('.nav-list__link--active')),
          10000
        );
        return;
      }
    }
    throw new Error(
      'The tab you are looking for on the dashboard does not exist'
    );
  }
  // The method opens the room editing form in the view tab
  async openEditRoomFormViaThreeDots(room) {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(until.elementsLocated(By.css('.room-name')), 10000);
    const rooms = await this.driver.findElements(By.css('.room-name'));
    for (let item of rooms) {
      if (item) {
        if ((await item.getText()) === room) {
          await this.driver.wait(
            until.elementLocated(By.css('.menu-list-dots-wrapper')),
            10000
          );
          const menuBtn = await item.findElement(
            By.css('.menu-list-dots-wrapper')
          );
          await this.driver.wait(until.elementIsEnabled(menuBtn), 10000);
          await menuBtn.click();
          break;
        }
      } else {
        throw new Error('Room is not created');
      }
    }
    await this.driver.wait(
      until.elementLocated(By.css('.editMenuList[editmenuroomopen]')),
      10000
    );
    const roomMenu = await this.driver.findElement(
      By.css('.editMenuList[editmenuroomopen]')
    );
    await this.driver.wait(until.elementLocated(By.id('editRoomBtn')), 10000);
    const editRoomBtn = await roomMenu.findElement(By.id('editRoomBtn'));
    await this.driver.wait(until.elementIsEnabled(editRoomBtn), 10000);
    await editRoomBtn.click();
  }

  //The method that allows you to select the number of entities to display on the page by default is 100, you can choose 10, 15, 20, 50, 100
  async selectNumberOfItemsPerPagination(number = '100') {
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementLocated(By.id('selectAmountItems')),
      10000
    );

    const paginationDropDown = await this.driver.findElement(
      By.id('selectAmountItems')
    );
    await this.driver
      .actions()
      .scroll(0, 0, 0, 0, paginationDropDown)
      .perform();

    const totalEl = await this.driver
      .findElement(By.className('total-item-text'))
      .getText();
    const numberEl = totalEl.split(' ');
    const numberOfCompanies = Number(numberEl[numberEl.length - 1]);

    if (numberOfCompanies > 20) {
      await paginationDropDown.click();
      const paginationList = await this.driver.findElements(
        By.className('ng-option')
      );
      await this.findDateInDropDown(paginationList, number);
      await this.waitListDate('.company-name', 21);
    }
  }
}
module.exports = Base;
