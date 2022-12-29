const Pool = require("pg").Pool;
const pool = new Pool({
  user: "bazki_user",
  host: "localhost",
  database: "bazki_projekt_database",
  password: "bazki_user_haslo",
  port: 5432,
});

const checkIfTableExists = (name = "warehouse") => {
  return new Promise(function (resolve, reject) {
    pool.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' and table_name = $1);",
      [name],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows[0].exists);
      }
    );
  });
};

const initialize = async () => {
  const ready = await checkIfTableExists();

  if (!ready) {
    console.log(await createTables());
  }
};

const createTables = async () => {
  const warehouseTable = new Promise(function (resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS warehouse (
                  id serial PRIMARY KEY, 
                  name VARCHAR(255),
                  amount DECIMAL(10,2) DEFAULT 0,
                  price DECIMAL(10,2) DEFAULT 0
              )`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      }
    );
  });

  await warehouseTable;

  const pomidor = new Promise(function (resolve, reject) {
    pool.query(
      `INSERT INTO warehouse (name, amount, price)
          VALUES ('pomidor', 10, 1.23)`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      }
    );
  });

  await pomidor;

  const maka = new Promise(function (resolve, reject) {
    pool.query(
      `INSERT INTO warehouse (name, amount, price)
          VALUES ('mąka', 20, 0.28)`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      }
    );
  });

  await maka;

  const enableHashing = new Promise(function (resolve, reject) {
    pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`, (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(true);
    });
  });

  await enableHashing;

  const usersTable = new Promise(function (resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS users (
                  id serial PRIMARY KEY,
                  login TEXT UNIQUE,
                  password_hash TEXT NOT NULL,
                  position TEXT DEFAULT 'customer' NOT NULL
              )`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      }
    );
  });

  await usersTable;

  const rootUser = new Promise(function (resolve, reject) {
    pool.query(
      `INSERT INTO users (login, password_hash, position)
          VALUES ('cookie_monster_11', crypt('Ilikecookies', gen_salt('bf')), 'manager')`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      }
    );
  });

  await rootUser;

  const customerUser = new Promise(function (resolve, reject) {
    pool.query(
      `INSERT INTO users (login, password_hash, position)
          VALUES ('asdf', crypt('asdfasdf', gen_salt('bf')), 'customer')`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      }
    );
  });

  await customerUser;
};

module.exports = {
  initialize,
};
