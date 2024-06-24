const Imap = require('node-imap');

function checkEmailsFromAddress(targetAddress, searchText) {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: 'olevova@ukr.net',
      password: 'ui4QVTN6OOlCKt2j',
      host: 'imap.ukr.net',
      port: 993,
      tls: true,
    });

    imap.once('ready', function () {
      imap.openBox('INBOX', true, function (err, box) {
        if (err) reject(err);

        const searchCriteria = ['UNSEEN', ['FROM', targetAddress]];

        imap.search(searchCriteria, function (err, results) {
          if (err) reject(err);

          if (results.length > 0) {
            const latestEmailUid = results[results.length - 1];
            const email = imap.fetch(latestEmailUid, {
              bodies: '',
              markSeen: true,
            });

            email.on('message', function (msg) {
              let emailContent = '';
              let receivedDate = '';

              msg.on('body', function (stream) {
                stream.on('data', function (chunk) {
                  emailContent += chunk.toString('utf8');
                });
              });

              msg.once('attributes', function (attrs) {
                receivedDate = new Date(attrs.date);
              });

              msg.once('end', function () {
                if (emailContent.includes(searchText)) {
                  resolve(receivedDate);
                } else {
                  resolve(false);
                }

                email.removeAllListeners();
                imap.end();
              });
            });
          } else {
            resolve(false);
            imap.end();
          }
        });
      });
    });

    imap.once('end', function () {
      console.log('close IMAP connection');
    });

    imap.connect();
  });
}

module.exports = checkEmailsFromAddress;
