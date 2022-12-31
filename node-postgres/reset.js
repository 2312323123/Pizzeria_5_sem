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
    const dropPricesTable = new Promise(function (resolve, reject) {
      pool.query("DROP TABLE prices", (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });

    await dropPricesTable;
    console.log("prices dropped successfully");
  } catch (e) {
    console.log(e);
  }

  try {
    const dropMenuTable = new Promise(function (resolve, reject) {
      pool.query("DROP TABLE menu", (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });

    await dropMenuTable;
    console.log("menu dropped successfully");
  } catch (e) {
    console.log(e);
  }

  try {
    const dropCouriersTable = new Promise(function (resolve, reject) {
      pool.query("DROP TABLE couriers", (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });

    await dropCouriersTable;
    console.log("couriers dropped successfully");
  } catch (e) {
    console.log(e);
  }

  try {
    const dropOrdersTable = new Promise(function (resolve, reject) {
      pool.query("DROP TABLE orders", (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });

    await dropOrdersTable;
    console.log("orders dropped successfully");
  } catch (e) {
    console.log(e);
  }

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
  } catch (e) {
    console.log(e);
  }

  try {
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
  } catch (e) {
    console.log(e);
  }

  try {
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

reset();
