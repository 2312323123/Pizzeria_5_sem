const Pool = require("pg").Pool;
const pool = new Pool({
  user: "bazki_user",
  host: "localhost",
  database: "bazki_projekt_database",
  password: "bazki_user_haslo",
  port: 5432,
});

const checkIfTableExists = (name = "merchants") => {
  return new Promise(function (resolve, reject) {
    pool.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' and table_name = $1);",
      [name],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`Does it work yet?: ${JSON.stringify(results.rows[0].exists)}`);
      }
    );
  });
};

const createTables = async () => {
  const warehouseTable = new Promise(function (resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS warehouse (
				id INTEGER PRIMARY KEY, 
				name VARCHAR(255) UNIQUE, a
				mount INTEGER
			)`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`Does it work yet?: ${JSON.stringify(results)}`);
      }
    );
  });

  const usersTable = new Promise(function (resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS users (
				id serial PRIMARY KEY,
				login TEXT UNIQUE,
				password_hash TEXT NOT NULL,
				position TEXT NOT NULL
			)`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`Does it work yet?: ${JSON.stringify(results)}`);
      }
    );
  });

  return await usersTable;
};

const getMerchants = () => {
  return new Promise(function (resolve, reject) {
    pool.query("SELECT * FROM merchants ORDER BY id ASC", (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results.rows);
    });
  });
};
const createMerchant = (body) => {
  return new Promise(function (resolve, reject) {
    const { name, email } = body;
    pool.query(
      "INSERT INTO merchants (name, email) VALUES ($1, $2) RETURNING *",
      [name, email],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`A new merchant has been added added: ${results.rows[0]}`);
      }
    );
  });
};
const deleteMerchant = () => {
  return new Promise(function (resolve, reject) {
    const id = parseInt(request.params.id);
    pool.query(
      "DELETE FROM merchants WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`Merchant deleted with ID: ${id}`);
      }
    );
  });
};

module.exports = {
  checkIfTableExists,
  createTables,
  getMerchants,
  createMerchant,
  deleteMerchant,
};
