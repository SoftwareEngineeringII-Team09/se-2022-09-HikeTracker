/***
 *  run this file to clean the DB and store only the default data defined in dbschema.sql 
 */
const sqlite = require("sqlite3");
const fs = require("fs");

async function main() {
  let SQL = fs.readFileSync("dbschema.sql", "ascii");

  let db = new sqlite.Database("DB.db", (err) => {
    
    if (err) {
      console.log(err);
      throw err;
    }
  });
  
  db.exec(SQL, function (err) {

    if (err) {
      console.log(err);
    }
    else
     
      console.log(
        "Main database correctly cleaned and filled with default data"
      );
  });
  
  SQL = fs.readFileSync("dbschemaTest.sql", "ascii");
  
  let dbTest = new sqlite.Database("DB.test.db", (err) => {
    if (err) {
      console.log(err);
      throw err;
    }
  });
  
  dbTest.exec(SQL, function (err) {
    if (err) {
      console.log(err);
    }
    else{
      console.log(
        "Test database correctly cleaned"
      );
    }
      
  });
}

main();
