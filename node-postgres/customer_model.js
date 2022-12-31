const Pool = require("pg").Pool;
const pool = new Pool({
  user: "bazki_user",
  host: "localhost",
  database: "bazki_projekt_database",
  password: "bazki_user_haslo",
  port: 5432,
});

const { authenticate } = require("./bazki_model");

const get_products = async (body) => {
  const position = await authenticate(body);

  if (position === "customer") {
    const prices = await get_prices(body);
    const ingredients = await get_ingredients(body);
    return Promise.resolve({ prices, ingredients });
  } else {
    throw new Error("someone not authorized tried to get customer products");
  }
};

const get_ingredients = async (body) => {
  const position = await authenticate(body);

  if (position === "customer") {
    return new Promise(function (resolve, reject) {
      pool.query(
        `SELECT m.name menu_name, w.name
        FROM menu m
        INNER JOIN warehouse w
        ON requirement_id = w.id
        ORDER BY m.name`,
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to get customer ingredients");
  }
};

const get_prices = async (body) => {
  const position = await authenticate(body);

  if (position === "customer") {
    return new Promise(function (resolve, reject) {
      pool.query(
        `SELECT name, price
        FROM prices
        ORDER BY name`,
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to get customer prices");
  }
};

const evaluate_delivery_time = async (body) => {
  const position = await authenticate(body);
  let { distance } = body;

  distance = Number(distance);
  if (isNaN(distance)) {
    throw new Error("wrong input type");
  }
  if (distance < 0) {
    throw new Error("distance lower than 0");
  }

  if (position === "customer") {
    const min_time = new Date();
    min_time.setMinutes(min_time.getMinutes + 40);
    const delivery_time = distance * 4 + 5;

    let couriers = await new Promise(function (resolve, reject) {
      pool.query(`SELECT * from couriers`, (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows);
      });
    });

    console.log(couriers);

    let deliveries = await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT courier_login, courier_start, courier_end 
      FROM orders
      WHERE courier_end > $1
      AND courier_login IN (SELECT login from couriers)
      ORDER BY courier_login ASC, courier_start ASC`,
        [Date.now()],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows);
        }
      );
    });

    console.log(deliveries);

    return new Promise(function (resolve, reject) {
      pool.query(
        `SELECT name, price
        FROM prices
        ORDER BY name`,
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to evaluate delivery time");
  }
};

module.exports = {
  get_products,
  evaluate_delivery_time,
};
