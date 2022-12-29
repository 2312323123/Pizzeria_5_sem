const Pool = require("pg").Pool;
const pool = new Pool({
  user: "bazki_user",
  host: "localhost",
  database: "bazki_projekt_database",
  password: "bazki_user_haslo",
  port: 5432,
});

const reset = async () => {
  try {
    const dropWarehouseTable = new Promise(function (resolve, reject) {
      pool.query("DROP TABLE warehouse", (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });

    await dropWarehouseTable;
    console.log("warehouse dropped successfully");

    const dropUsersTable = new Promise(function (resolve, reject) {
      pool.query("DROP TABLE users", (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });

    await dropUsersTable;
    console.log("users dropped successfully");

    process.exit();
  } catch (e) {
    console.log(e);
  }
};

reset();
