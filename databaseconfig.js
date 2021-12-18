const { createDatabase } = require('typeorm-extension');


(async () => {
  await createDatabase({ ifNotExist: true });
  wait = false;  
  process.exit(0);
})();
