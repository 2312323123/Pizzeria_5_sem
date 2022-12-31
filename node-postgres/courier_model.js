const Pool = require("pg").Pool;
const pool = new Pool({
  user: "bazki_user",
  host: "localhost",
  database: "bazki_projekt_database",
  password: "bazki_user_haslo",
  port: 5432,
});

const { authenticate } = require("./bazki_model");

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
