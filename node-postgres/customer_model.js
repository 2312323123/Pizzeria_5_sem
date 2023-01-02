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

  // console.log("----------------------");

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
    console.log("duration: " + duration / (60 * 1000) + " min");

    let couriers = await new Promise(function (resolve, reject) {
      pool.query(`SELECT * from couriers`, (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows);
      });
    });

    // console.log(couriers);

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

    // console.log(deliveries);

    const min_times = [];

    courier_loop_label: for (const courier of couriers) {
      courier.work_start = Number(courier.work_start);
      let work_start = new Date();
      let database_work_start = new Date(courier.work_start);
      work_start.setHours(database_work_start.getHours());
      work_start.setMinutes(database_work_start.getMinutes());
      work_start.setSeconds(database_work_start.getSeconds());
      work_start.setMilliseconds(database_work_start.getMilliseconds());

      courier.work_end = Number(courier.work_end);
      let work_end = new Date();
      let database_work_end = new Date(courier.work_end);
      work_end.setHours(database_work_end.getHours());
      work_end.setMinutes(database_work_end.getMinutes());
      work_end.setSeconds(database_work_end.getSeconds());
      work_end.setMilliseconds(database_work_end.getMilliseconds());

      let periods = deliveries.filter(
        (delivery) => delivery.courier_login === courier.login
      );
      periods = periods.map((period) => ({
        start: Number(period.courier_start),
        end: Number(period.courier_end),
      }));

      if (duration > work_end.getTime() - work_start.getTime()) {
        min_times.push({
          login: courier.login,
          delivery_start: undefined,
          delivery_end: undefined,
        });
        console.log("end1");
        console.log("date: " + undefined);
        console.log("->: " + undefined);
        continue;
      }

      if (periods.length === 0) {
        if (min_time > work_start) {
          if (min_time.getTime() + duration < work_end.getTime()) {
            min_times.push({
              login: courier.login,
              delivery_start: min_time.getTime(),
              delivery_end: min_time.getTime() + duration,
            });
            // console.log("end2");
            // console.log("date: " + new Date(Date.now()));
            // console.log("->: " + new Date(Date.now() + duration));
            // console.log(
            //   "min_time.getTime() + duration: " +
            //     new Date(min_time.getTime() + duration)
            // );
            // console.log("work_end.getTime(): " + new Date(work_end.getTime()));
            continue;
          } else {
            let tomorrow_start = new Date();
            tomorrow_start.setDate(tomorrow_start.getDate() + 1);
            tomorrow_start.setHours(database_work_start.getHours());
            tomorrow_start.setMinutes(database_work_start.getMinutes());
            tomorrow_start.setSeconds(database_work_start.getSeconds());
            tomorrow_start.setMilliseconds(
              database_work_start.getMilliseconds()
            );

            min_times.push({
              login: courier.login,
              delivery_start: tomorrow_start.getTime(),
              delivery_end: tomorrow_start.getTime() + duration,
            });
            // console.log("end3");
            // console.log("date: " + new Date(tomorrow_start.getTime()));
            // console.log("->: " + new Date(tomorrow_start.getTime() + duration));
            // console.log(
            //   "min_time.getTime() + duration: " +
            //     new Date(min_time.getTime() + duration)
            // );
            // console.log("work_end.getTime(): " + new Date(work_end.getTime()));
            continue;
          }
        } else {
          let today_start = new Date();
          today_start.setDate(today_start.getDate() + 1);
          today_start.setHours(database_work_start.getHours());
          today_start.setMinutes(database_work_start.getMinutes());
          today_start.setSeconds(database_work_start.getSeconds());
          today_start.setMilliseconds(database_work_start.getMilliseconds());

          min_times.push({
            login: courier.login,
            delivery_start: today_start.getTime(),
            delivery_end: today_start.getTime() + duration,
          });
          // console.log("end4");
          // console.log("date: " + new Date(today_start.getTime()));
          // console.log("->: " + new Date(today_start.getTime() + duration));
          continue;
        }
      }

      const time = new Date(min_time);

      if (time < work_start) {
        time.setTime(work_start.getTime());
      }
      if (time > work_end) {
        let tomorrow_start = new Date();
        tomorrow_start.setDate(tomorrow_start.getDate() + 1);
        tomorrow_start.setHours(database_work_start.getHours());
        tomorrow_start.setMinutes(database_work_start.getMinutes());
        tomorrow_start.setSeconds(database_work_start.getSeconds());
        tomorrow_start.setMilliseconds(database_work_start.getMilliseconds());

        time.setTime(tomorrow_start.getTime());
      }

      periods = periods.filter((period) => period.end > time.getTime());

      for (const period of periods) {
        if (
          period.start <= time.getTime() + duration &&
          time.getTime() + duration <= period.end
        ) {
          time.setTime(period.end);
        } else if (time.getTime() + duration < period.start) {
          if (time.getTime() + duration < work_end.getTime()) {
            min_times.push({
              login: courier.login,
              delivery_start: time.getTime(),
              delivery_end: time.getTime() + duration,
            });
            // console.log("end5");
            // console.log("date: " + new Date(time.getTime()));
            // console.log("->: " + new Date(time.getTime() + duration));
            continue courier_loop_label;
          } else {
            work_start.setDate(work_start.getDate() + 1);
            work_end.setDate(work_end.getDate() + 1);
            time.setTime(work_start.getTime());
          }
        }
      }

      min_times.push({
        login: courier.login,
        delivery_start: time.getTime(),
        delivery_end: time.getTime() + duration,
      });
      // console.log("end6");
      // console.log("current date: " + new Date());
      // console.log("date: " + new Date(time.getTime()));
      // console.log("->: " + new Date(time.getTime() + duration));
    }

    // console.log("min times: (kaboom)");
    // console.log(min_times);
    console.log(
      min_times.map((entry) => ({
        ...entry,
        delivery_start: new Date(entry.delivery_start).toISOString(),
        delivery_end: new Date(entry.delivery_end).toISOString(),
      }))
    );
    return min_times;
    // return {
    //   time: Math.min(
    //     ...min_times
    //       .filter((time) => typeof time.time !== "undefined")
    //       .map((time) => time.time)
    //   ),
    // };
  } else {
    throw new Error("someone not authorized tried to evaluate delivery time");
  }
};

const evaluate_delivery_time = async (body) => {
  const times = await evaluate_delivery_times(body);
  const best_time = times.reduce(
    (accumulator, current_value) =>
      current_value.delivery_end < accumulator
        ? current_value.delivery_end
        : accumulator,
    typeof times[0] !== "undefined" ? times[0].delivery_end : undefined
  );

  return { time: best_time };
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
  times = times.filter(
    (times_obj) =>
      typeof times_obj.delivery_start !== "undefined" &&
      typeof times_obj.delivery_end !== "undefined"
  );

  if (times.length <= 0) {
    throw new Error("noone can deliver");
  }

  const best_times = times.reduce((accumulator, current_value) =>
    current_value.delivery_end < accumulator.delivery_end
      ? current_value
      : accumulator
  );

  console.log("best times: ");
  console.log(best_times);

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

    console.log("user_id: " + user_id);
    console.log("login: " + login);

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
          best_times.delivery_start,
          best_times.delivery_end,
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
