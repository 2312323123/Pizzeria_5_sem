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

  if (position === "manager") {
    const prices = await get_prices(body);
    const ingredients = await get_ingredients(body);
    return Promise.resolve({ prices, ingredients });
  } else {
    throw new Error("someone not authorized tried to edit ingredients");
  }
};

const add_product = async (body) => {
  const position = await authenticate(body);
  const { name, id, amount } = body;

  if (position === "manager") {
    const taken = await new Promise(function (resolve, reject) {
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

    if (taken) {
      throw new Error("product name taken");
    }

    return new Promise(function (resolve, reject) {
      pool.query(
        `INSERT INTO menu (name, requirement_id, amount)
        VALUES ($1, $2, $3)`,
        [name, id, amount],
        async (error, results) => {
          if (error) {
            reject(error);
          }
          await update_prices_new_menu_entry(body);
          resolve(true);
        }
      );
    });
  } else {
    throw new Error("someone not authorized tried to edit ingredients");
  }
};

const delete_product = async (body) => {
  const position = await authenticate(body);
  const { name } = body;

  if (position === "manager") {
    const exists = await new Promise(function (resolve, reject) {
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

    if (!exists) {
      throw new Error("product doesn't exist");
    }

    await new Promise(function (resolve, reject) {
      pool.query(
        `DELETE FROM menu
        WHERE name = $1`,
        [name],
        async (error, results) => {
          if (error) {
            reject(error);
          }
          await update_prices(body);
          resolve(true);
        }
      );
    });

    return new Promise(function (resolve, reject) {
      pool.query(
        `DELETE FROM prices
        WHERE name = $1`,
        [name],
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
    throw new Error("someone not authorized tried to delete product");
  }
};

const change_product_name = async (body) => {
  const position = await authenticate(body);
  const { name, new_name } = body;

  if (position === "manager") {
    const result = await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT EXISTS (SELECT 1 FROM menu WHERE name=$1);`,
        [name],
        async (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows[0].exists);
        }
      );
    });

    if (result === true) {
      await new Promise(function (resolve, reject) {
        pool.query(
          `UPDATE menu
          SET name=$1
          WHERE name=$2`,
          [new_name, name],
          async (error, results) => {
            if (error) {
              reject(error);
            }
            resolve(true);
          }
        );
      });

      return new Promise(function (resolve, reject) {
        pool.query(
          `UPDATE prices
          SET name=$1
          WHERE name=$2`,
          [new_name, name],
          async (error, results) => {
            if (error) {
              reject(error);
            }
            resolve(true);
          }
        );
      });
    } else {
      throw new Error("name already taken");
    }
  } else {
    throw new Error("someone not authorized tried to change product name");
  }
};

const change_product_price = async (body) => {
  const position = await authenticate(body);
  const { name, price } = body;

  if (position === "manager") {
    const exists = await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT EXISTS (
          SELECT 1 FROM prices WHERE name=$1
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

    if (!exists) {
      throw new Error("price doesn't exists");
    }

    return new Promise(function (resolve, reject) {
      pool.query(
        `UPDATE prices
        SET price = $1
        WHERE name = $2`,
        [price, name],
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
    throw new Error("someone not authorized tried to change product price");
  }
};

const add_product_ingredient = async (body) => {
  const position = await authenticate(body);
  const { name, id, amount } = body;

  if (position === "manager") {
    const taken = await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT EXISTS (
          SELECT 1 FROM menu WHERE name=$1 AND requirement_id=$2
        )`,
        [name, id],
        async (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows[0].exists);
        }
      );
    });

    if (taken) {
      throw new Error("ingredient already exists");
    }

    return new Promise(function (resolve, reject) {
      pool.query(
        `INSERT INTO menu (name, requirement_id, amount)
        VALUES ($1, $2, $3)`,
        [name, id, amount],
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
    throw new Error("someone not authorized tried to add product ingredient");
  }
};

const change_product_ingredient_amount = async (body) => {
  const position = await authenticate(body);
  const { name, id, amount } = body;

  if (position === "manager") {
    const exists = await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT EXISTS (
          SELECT 1 FROM menu WHERE name=$1 AND requirement_id=$2
        )`,
        [name, id],
        async (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows[0].exists);
        }
      );
    });

    if (!exists) {
      throw new Error("ingredient doesn't exists");
    }

    return new Promise(function (resolve, reject) {
      pool.query(
        `UPDATE menu
        SET amount = $1
        WHERE name = $2 AND requirement_id = $3`,
        [amount, name, id],
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
    throw new Error("someone not authorized tried to add product ingredient");
  }
};

const delete_product_ingredient = async (body) => {
  const position = await authenticate(body);
  const { name, id } = body;

  if (position === "manager") {
    const exists = await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT EXISTS (
          SELECT 1 FROM menu WHERE name=$1 AND requirement_id=$2
        )`,
        [name, id],
        async (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows[0].exists);
        }
      );
    });

    if (!exists) {
      throw new Error("ingredient doesn't exist");
    }

    return new Promise(function (resolve, reject) {
      pool.query(
        `DELETE FROM menu
        WHERE name = $1 AND requirement_id = $2`,
        [name, id],
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
    throw new Error(
      "someone not authorized tried to delete product ingredient"
    );
  }
};

const update_prices_new_menu_entry = async (body) => {
  const position = await authenticate(body);

  if (position === "manager") {
    return new Promise(function (resolve, reject) {
      pool.query(
        `INSERT INTO prices (name, price, product_price)
        SELECT m.name, sum(m.amount*w.price)*1.8 price, sum(m.amount*w.price) product_price
        FROM menu m
        INNER JOIN warehouse w
        ON m.requirement_id = w.id
        WHERE NOT EXISTS(
          SELECT name
          FROM prices
          WHERE name=m.name
        )
        GROUP BY m.name`,
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

const get_ingredients = async (body) => {
  const position = await authenticate(body);

  if (position === "manager") {
    return new Promise(function (resolve, reject) {
      pool.query(
        `SELECT m.name menu_name, requirement_id id, w.name, m.amount
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
    throw new Error("someone not authorized tried to get manager ingredients");
  }
};

const get_prices = async (body) => {
  const position = await authenticate(body);

  if (position === "manager") {
    return new Promise(function (resolve, reject) {
      pool.query(
        `SELECT name, product_price, price
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
    throw new Error("someone not authorized tried to get manager prices");
  }
};

module.exports = {
  get_products,
  add_product,
  delete_product,
  change_product_name,
  change_product_price,
  add_product_ingredient,
  change_product_ingredient_amount,
  delete_product_ingredient,
  update_prices_new_menu_entry,
  update_prices,
};
