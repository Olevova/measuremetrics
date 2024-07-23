const Mocha = require('mocha');
const path = require('path');
const fs = require('fs');
const {
  browsers,
  createDriver,
  isRunningInTeamCity,
  isRunningInDocker,
} = require('./src/utils/webdriver');

async function createDriverForTest(browser, bVersion, os) {
  return await createDriver(browser, bVersion, os);
}

async function runAllTests() {
  const testDir = './test'; // Директорія з тестовими файлами
  const mocha = new Mocha({
    timeout: 0,
  });

  // Додаємо всі тестові файли з директорії
  fs.readdirSync(testDir)
    .filter(file => {
      return file.endsWith('.test.js');
    })
    .forEach(file => {
      mocha.addFile(path.join(testDir, file));
    });

  function runTests(func) {
    if (isRunningInDocker || isRunningInTeamCity) {
      browsers.forEach(({ browser, bVersion, os }) => {
        func(browser, bVersion, os);
      });
    } else {
      func('Chrome', 'latest', 'local');
    }
  }

  runTests((browser, bVersion, os) => {
    mocha.suite.eachTest(test => {
      test.fn = async function () {
        // this.retries(1); // Встановлення кількості спроб для тесту
        this.driver = await createDriverForTest(browser, bVersion, os);
        try {
          await test.fn.apply(this, arguments);
        } finally {
          if (this.driver) {
            await this.driver.quit();
          }
        }
      };
    });

    if (!isRunningInDocker && !isRunningInTeamCity) {
      mocha.reporter('mochawesome', {
        reportDir: 'colorjob',
        reportFilename: 'reports',
      });
    }

    mocha.run(failures => {
      process.exitCode = failures ? 1 : 0;
    });
  });
}

runAllTests().catch(err => {
  console.error(err);
  process.exit(1);
});
