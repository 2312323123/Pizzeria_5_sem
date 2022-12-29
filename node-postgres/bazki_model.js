const Pool = require("pg").Pool;
const pool = new Pool({
  user: "bazki_user",
  host: "localhost",
  database: "bazki_projekt_database",
  password: "bazki_user_haslo",
  port: 5432,
});

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

  if (position === "manager" || position === "deliverer") {
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
        (error, results) => {
          if (error) {
            reject(error);
          }
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
        (error, results) => {
          if (error) {
            reject(error);
          }
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
  const { id, amount } = body;

  if (position === "deliverer") {
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
  const id = body.id;

  if (
    edit_position === "manager" ||
    edit_position === "deliverer" ||
    edit_position === "supplier" ||
    edit_position === "customer"
  ) {
    if (position === "manager") {
      return new Promise(function (resolve, reject) {
        pool.query(
          `UPDATE users
            SET position = $1
            WHERE id = $2`,
          [edit_position, id],
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
  authenticate,
  register,
  getIngredients,
  editIngredient,
  addIngredient,
  deleteIngredient,
  supplyIngredient,
  getUsers,
  editUser,
  getMerchants,
  createMerchant,
  deleteMerchant,
};
