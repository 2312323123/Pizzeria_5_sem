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
    await createTables();
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

  const produkty = new Promise(function (resolve, reject) {
    pool.query(
      `INSERT INTO warehouse (name, amount, price)
          VALUES ('pomidor', 10, 1.23),
          ('mąka', 20, 0.28),
          ('szynka', 50, 31.23),
          ('pomidor', 20, 12.99),
          ('cebula', 20, 7.49),
          ('kukurydza', 10, 11.53),
          ('pieczarki', 50, 17.83),
          ('pepperoni', 50, 34.61),
          ('papryka', 30, 9.87),
          ('oliwki', 10, 21.50)`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      }
    );
  });

  await produkty;

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

  const pricesTable = new Promise(function (resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS prices (
                  name TEXT,
                  price DECIMAL(10,2) DEFAULT 0,
                  product_price DECIMAL(10,2) DEFAULT 0
              )`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      }
    );
  });

  await pricesTable;

  const courierBusyTable = new Promise(function (resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS courier_busy (
                  id serial PRIMARY KEY,
                  order_id INTEGER UNIQUE NOT NULL,
                  start_timestamp TIMESTAMP NOT NULL,
                  end_timestamp TIMESTAMP NOT NULL
              )`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      }
    );
  });

  await courierBusyTable;

  const menuTable = new Promise(function (resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS menu (
                  id serial PRIMARY KEY,
                  name TEXT,
                  requirement_id INTEGER NOT NULL REFERENCES warehouse(id),
                  amount DECIMAL(10,2) DEFAULT 0 NOT NULL
              )`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      }
    );
  });

  await menuTable;

  const menu_entries = new Promise(function (resolve, reject) {
    pool.query(
      `INSERT INTO menu (name, requirement_id, amount)
          VALUES ('chyba jakaś pizza', 2, 1.23),
          ('chyba jakaś pizza', 3, 1.23),
          ('pizza #2', 2, 0.28),
          ('pizza #2', 5, 0.28),
          ('pizza #3', 1, 1.28)`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      }
    );
  });

  await menu_entries;

  const prices_entries = new Promise(function (resolve, reject) {
    // pool.query(
    //   `INSERT INTO prices (name, price, product_price)
    //       VALUES ('chyba jakaś pizza', 40, 1.23),
    //       ('pizza #2', 10, 0.28),
    //       ('pizza #3', 5, 0.28)`,pool.query(
    pool.query(
      `INSERT INTO prices (name, price, product_price)
        SELECT m.name, sum(m.amount*w.price)*1.8 price, sum(m.amount*w.price) product_price
        FROM menu m
        INNER JOIN warehouse w
        ON m.requirement_id = w.id
        GROUP BY m.name`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      }
    );
  });

  await prices_entries;

  const couriers = new Promise(function (resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS couriers (
                  id INTEGER NOT NULL REFERENCES users(id),
                  name TEXT,
                  works_start BIGINT NOT NULL DEFAULT 0,
                  works_end BIGINT NOT NULL DEFAULT 0
              )`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      }
    );
  });

  await couriers;

  const orders = new Promise(function (resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS orders (
                  order_id serial PRIMARY KEY,
                  user_id INTEGER NOT NULL REFERENCES users(id),
                  courier_id INTEGER,
                  date BIGINT,
                  name TEXT NOT NULL,
                  price DECIMAL(10,2)
              )`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      }
    );
  });

  await orders;

  const initializeUsers = new Promise(function (resolve, reject) {
    pool.query(
      `INSERT INTO users (login, password_hash, position)
          VALUES ('cookie_monster_11', crypt('Ilikecookies', gen_salt('bf')), 'manager'),
          ('customer', crypt('asdfasdf', gen_salt('bf')), 'customer'),
          ('deliverer', crypt('asdfasdf', gen_salt('bf')), 'deliverer'),
          ('supplier', crypt('asdfasdf', gen_salt('bf')), 'supplier')`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      }
    );
  });

  await initializeUsers;

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
