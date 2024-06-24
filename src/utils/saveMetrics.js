const fs = require('fs');
const path = require('path')

function saveMetrics(metricsFilePath, fileName, metrics){
    const filePath = path.join(metricsFilePath, fileName);
    const todayDate = new Date().toISOString().split('T')[0];
    let currentData = {};
    if (fs.existsSync(filePath)) {
        try {
          currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          console.log(currentData);
        } catch (err) {
          console.error('Error parsing JSON file:', err);
        }
      }

      if (currentData[todayDate]) {
        currentData[todayDate] = {
          ...currentData[todayDate],
          ...metrics,
        };
      } else {
        currentData[todayDate] = metrics;
      }

      fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));

      console.log(metrics);
    } 

    module.exports  = { saveMetrics }
