const { By, until, error } = require('selenium-webdriver');
const Base = require('../../base');

class CheckRoomGrouping extends Base {

  async compareArraysOfObjects(arr1, arr2) {
    for (const obj1 of arr1) {
        const key = Object.keys(obj1)[0];
        const obj2 = arr2.find(obj => obj.hasOwnProperty(key));

        if (obj2) {
            const arr1Values = obj1[key].sort();
            const arr2Values = obj2[key].sort();

            console.log(arr1Values , 'and', arr2Values);

            if (JSON.stringify(arr1Values) !== JSON.stringify(arr2Values)) {
                return false;
            }
        } else {
            return false;
        }
    }

    return true;
}

  constructor(driver) {
    super(driver);
    this.driver = driver;
    this.roomNumberwithSameNameOnOneFloor = null;
    this.areaNumbersInTheRoomSWithTHeSameName = null;
    this.viewRoomName = [];
    this.floor = '';
    this.projectRoomName = [];
  }

  async roomGroupingWithSameNameInViewTab() {
    await this.driver.wait(
      until.elementsLocated(By.css('.rooms-list__item')),
      10000
    );
    const rooms = await this.driver.findElements(By.css('.rooms-list__item'));
    const floorActive = await this.driver.findElement(
      By.css('.cdk-drag.floor-item.active')
    );
    this.floor = await floorActive.getAttribute('title');
    for (const room of rooms) {
      const roomName = await room
        .findElement(By.css('.room-arrow-with-name-wrapper'))
        .getAttribute('title');
      const areas = await room.findElements(
        By.css('.area-box-with-name-wrapper span:nth-child(2)')
      );

      const existingRoom = this.viewRoomName.find(obj =>
        Object.keys(obj).includes(roomName)
      );
      if (!existingRoom) {
        const newObj = {};
        newObj[roomName] = [];
        for (let area of areas) {
          const areaName = await area.getText();
          if(newObj[roomName].includes(areaName)){
            continue
          } else{
            newObj[roomName].push(areaName);
          }
          
        }
        this.viewRoomName.push(newObj);
      } else {
        for (let area of areas) {
          const areaName = await area.getText();
          if (existingRoom[roomName].includes(areaName)){
            continue
          } else{
            existingRoom[roomName].push(areaName);
          }
          
        }
      }
    }
  }
  async checkGroupingInProjectProgressTab() {
    await this.driver.wait(until.elementLocated(By.css('html')), 10000);
    await this.driver.executeScript('return document.readyState');
    await this.driver.wait(
      until.elementsLocated(By.css(`.area-progress-list-areas__item`)),
      10000
    );
    await this.driver.wait(
      until.elementLocated(By.css('.rooms-list')),
      10000
    );
    const allRoomsList = await this.driver.findElements(
      By.css('.rooms-list .room')
    );
    
    for (let room of allRoomsList) {
        const roomName = await room.findElement(By.css('.room-name')).getText();
        // console.log(roomName, 'roomname');
        const existingRoomProject  = this.projectRoomName.find(obj=>Object.keys(obj).includes(roomName));
        if(!existingRoomProject){
          const  newObj = {};
          newObj[roomName] = [];
          const areasList = await room.findElements(By.css('.room-areas .ng-star-inserted'));
          for (let area of areasList){
          const areaName = await area.getText();
          newObj[roomName].push(areaName)
          // console.log(newObj[roomName], 'obj');
        }
        this.projectRoomName.push(newObj);
        }
        // let newObj = {};
        // newObj[roomName] = [];
        // const areasList = await room.findElements(By.css('.room-areas .ng-star-inserted'));
        // for (let area of areasList){
        //   const areaName = await area.getText();
        //   newObj[roomName].push(areaName)
        //   console.log(newObj[roomName], 'obj');
        // }
        // this.projectRoomName.push(newObj);
      // let checkFloor = await floor
      //   .findElement(By.css('p.floor-cell-name'))
      //   .getAttribute('title');
      //   console.log(await checkFloor, 'checkFloor');
      // if (checkFloor === this.floor) {
      //   const areas = await floor.findElements(
      //     By.css('.area-progress-list-areas__item[status]')
      //   );
      //   for (let area of areas) {
      //     let areaFull = await area.getAttribute('combination-id');
      //     if (areaFull != null) {
      //       let accordingTheRoom = areaFull.split('_');
      //       let areaRoomName = await area.getAttribute('area-name');
      //       console.log(await areaRoomName, 'areaRoomName');
      //       let roomNameProject = accordingTheRoom[accordingTheRoom.length - 1];
      //       const existingRoomProject = this.projectRoomName.find(obj =>
      //         Object.keys(obj).includes(roomNameProject)
      //       );
      //       if (!existingRoomProject) {
      //         const newObj = {};
      //         newObj[roomNameProject] = [];
      //         newObj[roomNameProject].push(areaRoomName);
      //         this.projectRoomName.push(newObj);
      //       } else {
      //         existingRoomProject[roomNameProject].push(areaRoomName);
      //       }
      //     }
      //   }
      // }
    }

    const result = await this.compareArraysOfObjects(this.projectRoomName,this.viewRoomName )
    console.log(this.projectRoomName,'project-tab', this.viewRoomName,'view-tab', result);
    if(result){
        console.log("room grouping work");
    } else {
      throw new Error('room grouping not work check screenshot');
    }
    
    // this.driver.sleep(2000);
    // const stringifiedArray1 = JSON.stringify(this.viewRoomName);
    // const stringifiedArray2 = JSON.stringify(this.projectRoomName);

    // if (stringifiedArray1 === stringifiedArray2) {
    //   console.log("room grouping work");
    // } else {
    //   throw new Error('room grouping not work check screenshot');
    // }
    this.driver.sleep(1000);
  }
}

module.exports = CheckRoomGrouping;
