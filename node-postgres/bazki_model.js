const Pool = require("pg").Pool;
const pool = new Pool({
  user: "bazki_user",
  host: "localhost",
  database: "bazki_projekt_database",
  password: "bazki_user_haslo",
  port: 5432,
});

const update_prices = async (body) => {
  const position = await authenticate(body);

  if (position === "manager") {
    return new Promise(function (resolve, reject) {
      pool.query(
        `UPDATE prices
        SET product_price = (SELECT SUM(m.amount * w.price)
                              FROM menu m
                              INNER JOIN warehouse w
                              ON m.requirement_id = w.id
                              WHERE m.name = prices.name)`,
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(true);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to update prices");
  }
};

const authenticate = async (body) => {
  const { login, password } = body;
  const existsCheck = new Promise(function (resolve, reject) {
    pool.query(
      `SELECT EXISTS(
      SELECT FROM users 
      WHERE login = $1 AND password_hash = crypt($2, password_hash))`,
      [login, password],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows[0].exists);
      }
    );
  });

  const exists = await existsCheck;

  if (!exists) {
    return "unauthenticated";
  }

  return new Promise(function (resolve, reject) {
    pool.query(
      `SELECT position FROM users 
      WHERE login = $1 AND password_hash = crypt($2, password_hash)`,
      [login, password],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows[0].position);
      }
    );
  });
};

const register = async (body) => {
  const { login, password } = body;

  if (!login || password.toString().length < 8) {
    return "unauthenticated";
  }

  const existsCheck = new Promise(function (resolve, reject) {
    pool.query(
      `SELECT EXISTS(
      SELECT FROM users 
      WHERE login = $1)`,
      [login],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows[0].exists);
      }
    );
  });

  const exists = await existsCheck;

  if (exists) {
    return "unauthenticated";
  }

  return new Promise(function (resolve, reject) {
    pool.query(
      `INSERT INTO users (login, password_hash, position)
          VALUES ($1, crypt($2, gen_salt('bf')), 'customer')`,
      [login, password],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve("customer");
      }
    );
  });
};

const getIngredients = async (body) => {
  const position = await authenticate(body);

  if (position === "manager" || position === "supplier") {
    return new Promise(function (resolve, reject) {
      pool.query(
        "SELECT * FROM warehouse ORDER BY name ASC",
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to access ingredients");
  }
};

const editIngredient = async (body) => {
  const position = await authenticate(body);
  const { name, price, id } = body;

  if (position === "manager") {
    return new Promise(function (resolve, reject) {
      pool.query(
        `UPDATE warehouse
          SET name = $1, price = $2
          WHERE id = $3`,
        [name, price, id],
        async (error, results) => {
          if (error) {
            reject(error);
          }
          await update_prices(body);
          resolve(true);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to edit ingredients");
  }
};

const addIngredient = async (body) => {
  const position = await authenticate(body);

  let { name, price, amount } = body;

  if (!amount) {
    amount = 0;
  }

  if (position === "manager") {
    return new Promise(function (resolve, reject) {
      pool.query(
        `INSERT INTO warehouse (name, amount, price)
            VALUES ($1, $2, $3)`,
        [name, amount, price],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(true);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to add ingredients");
  }
};

const deleteIngredient = async (body) => {
  const position = await authenticate(body);
  const { id } = body;

  if (position === "manager") {
    return new Promise(function (resolve, reject) {
      pool.query(
        `DELETE FROM warehouse
          WHERE id = $1`,
        [id],
        async (error, results) => {
          if (error) {
            reject(error);
          }
          await update_prices(body);
          resolve(true);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to delete ingredients");
  }
};

const supplyIngredient = async (body) => {
  const position = await authenticate(body);
  let { id, amount } = body;
  amount = Number(amount);
  if (isNaN(amount)) {
    amount = 0;
  }

  if (position === "supplier") {
    return new Promise(function (resolve, reject) {
      pool.query(
        `UPDATE warehouse
          SET amount = amount + $1
          WHERE id = $2`,
        [amount, id],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(true);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to supply ingredients");
  }
};

const getUsers = async (body) => {
  const position = await authenticate(body);

  if (position === "manager") {
    return new Promise(function (resolve, reject) {
      pool.query(
        "SELECT login, position FROM users ORDER BY login ASC",
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to access users");
  }
};

const editUser = async (body) => {
  const position = await authenticate(body);
  const edit_position = body.position;
  const login = body.loginToEdit;
  if (
    edit_position === "manager" ||
    edit_position === "deliverer" ||
    edit_position === "supplier" ||
    edit_position === "customer"
  ) {
    if (position === "manager") {
      if (edit_position === "deliverer") {
        const deliverersAmountPromise = new Promise(function (resolve, reject) {
          pool.query(
            `SELECT COUNT(login)
              FROM users
              WHERE position = 'deliverer'`,
            (error, results) => {
              if (error) {
                reject(error);
              }
              resolve(results.rows[0].count);
            }
          );
        });

        const deliverersAmount = await deliverersAmountPromise;

        if (deliverersAmount >= 3) {
          // throw new Error("max deliverers amount reached");
          return Promise.reject({ message: "max deliverers amount reached" });
        } else {
          await new Promise(function (resolve, reject) {
            pool.query(
              `INSERT INTO couriers (login, work_start, work_end)
              VALUES ($1, $2, $3)`,
              [
                login,
                new Date(1970, 0, 1, 14).getTime(),
                new Date(1970, 0, 1, 22).getTime(),
              ],
              (error, results) => {
                if (error) {
                  reject(error);
                }
                resolve(true);
              }
            );
          });
        }
      }

      return new Promise(function (resolve, reject) {
        pool.query(
          `UPDATE users
            SET position = $1
            WHERE login = $2`,
          [edit_position, login],
          (error, results) => {
            if (error) {
              reject(error);
            }
            resolve(true);
          }
        );
      });
    } else {
      throw new Error("someone not authorized tried to edit users");
    }
  } else {
    throw new Error("trying to assign unknown position");
  }
};

const delete_user = async (body) => {
  const position = await authenticate(body);
  const { user_login } = body;

  if (position === "manager") {
    const exists = await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT EXISTS (
          SELECT 1 FROM users WHERE login=$1
        )`,
        [user_login],
        async (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows[0].exists);
        }
      );
    });

    if (!exists) {
      throw new Error("user doesn't exist");
    }

    const user_position_query = await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT position FROM users WHERE login=$1`,
        [user_login],
        async (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        }
      );
    });

    const user_position = await user_position_query.rows[0].position;

    if (user_position === "deliverer") {
      await new Promise((resolve, reject) => {
        pool.query(
          `DELETE FROM couriers
          WHERE login = $1`,
          [user_login],
          async (error, results) => {
            if (error) {
              reject(error);
            }
            resolve(true);
          }
        );
      });
    }

    return new Promise(function (resolve, reject) {
      pool.query(
        `DELETE FROM users
        WHERE login = $1`,
        [user_login],
        async (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(true);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to delete user");
  }
};

module.exports = {
  authenticate,
  register,
  getIngredients,
  editIngredient,
  addIngredient,
  deleteIngredient,
  supplyIngredient,
  getUsers,
  editUser,
  delete_user,
};
