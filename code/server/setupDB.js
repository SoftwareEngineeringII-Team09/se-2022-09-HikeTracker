/***
 *  run this file to clean the DB and store only the default data defined in dbschema.sql 
 */
const sqlite = require("sqlite3");
const fs = require("fs");

async function main() {
  const SQL = fs.readFileSync("dbschema.sql", "ascii");

  db = new sqlite.Database("DB.db", (err) => {
    if (err) {
      console.log(err);
      throw err;
    }
  });

  await db.exec(SQL, function (err) {
    if (err) console.log(err);
    else
      console.log(
        "Database correctly cleaned and filled with default data"
      );
  });
}

main();
