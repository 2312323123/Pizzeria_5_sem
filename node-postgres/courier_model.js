const Pool = require("pg").Pool;
const pool = new Pool({
  user: "bazki_user",
  host: "localhost",
  database: "bazki_projekt_database",
  password: "bazki_user_haslo",
  port: 5432,
});

const { authenticate } = require("./bazki_model");

const courier_history = async (body) => {
  const position = await authenticate(body);
  const { login } = body;

  if (position === "deliverer") {
    return new Promise(function (resolve, reject) {
      pool.query(
        `SELECT date, name, delivered, distance, price
          FROM orders
          WHERE courier_login = $1
          ORDER BY date DESC`,
        [login],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to get customer history");
  }
};

const courier_deliveries = async (body) => {
  const position = await authenticate(body);
  const { login } = body;

  if (position === "deliverer") {
    return new Promise(function (resolve, reject) {
      pool.query(
        `SELECT id, date, name, delivered, courier_start, courier_end, distance, price
          FROM orders
          WHERE courier_login = $1 AND delivered = false
          ORDER BY courier_start ASC`,
        [login],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to get customer history");
  }
};

const delivered = async (body) => {
  const position = await authenticate(body);
  const { login, id } = body;

  if (position === "deliverer") {
    return new Promise(function (resolve, reject) {
      pool.query(
        `UPDATE orders
        SET delivered = true
        WHERE id = $1 AND courier_login = $2`,
        [id, login],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to deliver");
  }
};

module.exports = {
  courier_history,
  courier_deliveries,
  delivered,
};
