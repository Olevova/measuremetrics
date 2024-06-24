const fs = require('fs');
const path = require('path');

// function which make screenshot if we need it
async function makeScreenshot(driver, photoname) {
  try {
    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }

    const screenshotFilename = `${photoname}_screen.png`;
    const screenshotPath = path.join(screenshotsDir, screenshotFilename);
    if (fs.existsSync(screenshotPath)) {
      fs.unlinkSync(screenshotPath);
    }

    const screenshotData = await driver.takeScreenshot();
    fs.writeFileSync(screenshotPath, screenshotData, 'base64');
  } catch (error) {
    console.error('Error while taking a screenshot:', error);
  }
}

module.exports = makeScreenshot;
