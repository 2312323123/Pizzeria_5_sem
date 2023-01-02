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

const evaluate_delivery_times = async (body) => {
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
    const preparation_time = 40; // [min]

    const min_time = new Date();
    min_time.setMinutes(min_time.getMinutes() + preparation_time);
    const duration = (distance * 4 + 5) * 60 * 1000;

    let couriers = await new Promise(function (resolve, reject) {
      pool.query(`SELECT * from couriers`, (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows);
      });
    });

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

    deliveries = deliveries.map((delivery) => ({
      login: delivery.courier_login,
      start: new Date(Number(delivery.courier_start)),
      end: new Date(Number(delivery.courier_end)),
    }));

    const getTodayWorkStart = (courier) => {
      let work_start = new Date();
      let database_work_start = new Date(Number(courier.work_start));
      work_start.setHours(database_work_start.getHours());
      work_start.setMinutes(database_work_start.getMinutes());
      work_start.setSeconds(database_work_start.getSeconds());
      work_start.setMilliseconds(database_work_start.getMilliseconds());

      return work_start;
    };
    const getTodayWorkEnd = (courier) => {
      let work_end = new Date();
      let database_work_end = new Date(Number(courier.work_end));
      work_end.setHours(database_work_end.getHours());
      work_end.setMinutes(database_work_end.getMinutes());
      work_end.setSeconds(database_work_end.getSeconds());
      work_end.setMilliseconds(database_work_end.getMilliseconds());

      return work_end;
    };
    const getStartTime = (work_start, work_end) => {
      let result = new Date();
      if (result < work_start) {
        result = new Date(work_start.getTime());
      }
      if (result < min_time) {
        result = new Date(min_time.getTime());
      }
      if (result > work_end) {
        work_start.setDate(work_start.getDate() + 1);
        work_end.setDate(work_end.getDate() + 1);
        result = new Date(work_start.getTime());
      }
      return result;
    };
    const tooLong = (work_start, work_end, duration) => {
      return work_end - work_start < duration;
    };

    const is_ok = (time, duration, start, end, work_start, work_end) => {
      const time_end = new Date(time.getTime() + duration);

      if (
        (time >= start && time < end) ||
        (time_end > start && time_end <= end)
      ) {
        return false;
      }

      if (time_end > work_end) {
        return false;
      }

      return true;
    };
    const is_ok_next = (time, duration, next_order) => {
      if (typeof next_order === "undefined") {
        return true;
      }

      const { start, end } = next_order;
      const time_end = new Date(time.getTime() + duration);

      if (
        (time >= start && time < end) || // tu te <= dodalem, ale sprawdz czy dobrze potem
        (time_end > start && time_end <= end)
      ) {
        return false;
      }

      return true;
    };

    const try_making_ok = (
      time,
      duration,
      start,
      end,
      work_start,
      work_end
    ) => {
      time.setTime(end.getTime());

      const time_end = new Date(time.getTime() + duration);

      if (time_end > work_end) {
        work_start.setDate(work_start.getDate() + 1);
        work_end.setDate(work_end.getDate() + 1);
        time.setTime(work_start.getTime());
      }
    };

    const results = [];

    courier_loop: for (const courier of couriers) {
      let work_start = getTodayWorkStart(courier);
      let work_end = getTodayWorkEnd(courier);
      let time = getStartTime(work_start, work_end); // moze ustawic work_start, work_end na jutrzejsze

      let orders = deliveries.filter(
        (delivery) => delivery.login === courier.login
      );

      const { login } = courier;

      orders = orders.filter((delivery) => delivery.end > time);

      if (tooLong(work_start, work_end, duration)) {
        // results.push({login: courier.login, start: undefined, end: undefined})
        break; // jak nie moze dostarczyc to niech nie zwraca go wgl
      }

      if (orders.length === 0) {
        results.push({
          login,
          start: time,
          end: new Date(time.getTime() + duration),
        });
        break;
      }

      for (let i = 0; i < orders.length; i++) {
        const { start, end } = orders[i];

        if (is_ok(time, duration, start, end, work_start, work_end)) {
          if (is_ok_next(time, duration, orders[i + 1])) {
            // czy nie koliduje z kolejnym
            results.push({
              login,
              start: time,
              end: new Date(time.getTime() + duration),
            });
            continue courier_loop;
          }
        }

        try_making_ok(time, duration, start, end, work_start, work_end);
      }

      results.push({
        login,
        start: time,
        end: new Date(time.getTime() + duration),
      });
    }

    return results;
  } else {
    throw new Error("someone not authorized tried to evaluate delivery time");
  }
};

const evaluate_delivery_time = async (body) => {
  const times = await evaluate_delivery_times(body);
  const best_time = times.reduce(
    (accumulator, current_value) =>
      current_value.end < accumulator ? current_value.end : accumulator,
    typeof times[0] !== "undefined" ? times[0].end : undefined
  );

  return { time: best_time.getTime() };
};

const order = async (body) => {
  const position = await authenticate(body);
  let { login, name, distance } = body;

  distance = Number(distance);
  if (isNaN(distance)) {
    throw new Error("wrong input type");
  }
  if (distance < 0) {
    throw new Error("distance lower than 0");
  }

  let times = await evaluate_delivery_times(body);

  times = times.map((timeObj) => ({
    login: timeObj.login,
    start: timeObj.start.getTime(),
    end: timeObj.end.getTime(),
  }));

  if (times.length <= 0) {
    throw new Error("noone can deliver");
  }

  const best_times = times.reduce((accumulator, current_value) =>
    current_value.end < accumulator.end ? current_value : accumulator
  );

  if (position === "customer") {
    const is_in_menu = await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT EXISTS (
            SELECT 1 FROM menu WHERE name=$1
          )`,
        [name],
        async (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows[0].exists);
        }
      );
    });

    if (!is_in_menu) {
      throw new Error("no such product");
    }

    const price = await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT price
        FROM prices
        WHERE name = $1`,
        [name],
        async (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(Number(results.rows[0].price));
        }
      );
    });

    const user_id = await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT id
        FROM users
        WHERE login = $1`,
        [login],
        async (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(Number(results.rows[0].id));
        }
      );
    });

    return new Promise(function (resolve, reject) {
      pool.query(
        `INSERT INTO orders (user_id, courier_login, date, name, price, courier_start, courier_end, distance)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          user_id,
          best_times.login,
          Date.now(),
          name,
          price,
          best_times.start,
          best_times.end,
          distance,
        ],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(true);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to order");
  }
};

const history = async (body) => {
  const position = await authenticate(body);
  const { login } = body;

  if (position === "customer") {
    const id = await new Promise((resolve, reject) => {
      pool.query(
        `SELECT id
        FROM users
        WHERE login = $1`,
        [login],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows[0].id);
        }
      );
    });

    return new Promise(function (resolve, reject) {
      pool.query(
        `SELECT date, name, delivered, distance
          FROM orders
          WHERE user_id = $1
          ORDER BY date DESC`,
        [id],
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

module.exports = {
  get_products,
  evaluate_delivery_time,
  order,
  history,
};
