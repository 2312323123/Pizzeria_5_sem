const express = require("express");
const app = express();
const port = 3001;

const bazki_model = require("./bazki_model");
const inicjalizacja = require("./inicjalizacja_model");
const manager_menu_model = require("./manager_menu_model");
const customer_model = require("./customer_model");
const courier_model = require("./courier_model");

inicjalizacja.initialize();

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

app.post("/login", async (req, res) => {
  try {
    const result = await bazki_model.authenticate(req.body);
    res.status(200).send({ position: result });
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/register", async (req, res) => {
  try {
    const result = await bazki_model.register(req.body);
    res.status(200).send({ position: result });
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/ingredients", async (req, res) => {
  try {
    const result = await bazki_model.getIngredients(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/edit_ingredient", async (req, res) => {
  try {
    const result = await bazki_model.editIngredient(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/add_ingredient", async (req, res) => {
  try {
    const result = await bazki_model.addIngredient(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/delete_ingredient", async (req, res) => {
  try {
    const result = await bazki_model.deleteIngredient(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/supply_ingredient", async (req, res) => {
  try {
    const result = await bazki_model.supplyIngredient(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/get_users", async (req, res) => {
  try {
    const result = await bazki_model.getUsers(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/edit_user", async (req, res) => {
  try {
    const result = await bazki_model.editUser(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/delete_user", async (req, res) => {
  try {
    const result = await bazki_model.delete_user(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

/* manager_menu_model */

app.post("/get_products", async (req, res) => {
  try {
    const result = await manager_menu_model.get_products(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/add_product", async (req, res) => {
  try {
    const result = await manager_menu_model.add_product(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/delete_product", async (req, res) => {
  try {
    const result = await manager_menu_model.delete_product(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/change_product_name", async (req, res) => {
  try {
    const result = await manager_menu_model.change_product_name(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/change_product_price", async (req, res) => {
  try {
    const result = await manager_menu_model.change_product_price(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/add_product_ingredient", async (req, res) => {
  try {
    const result = await manager_menu_model.add_product_ingredient(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/change_product_ingredient_amount", async (req, res) => {
  try {
    const result = await manager_menu_model.change_product_ingredient_amount(
      req.body
    );
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/delete_product_ingredient", async (req, res) => {
  try {
    const result = await manager_menu_model.delete_product_ingredient(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/customer_menu", async (req, res) => {
  try {
    const result = await customer_model.get_products(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/evaluate_delivery_time", async (req, res) => {
  try {
    const result = await customer_model.evaluate_delivery_time(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/order", async (req, res) => {
  try {
    const result = await customer_model.order(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/history", async (req, res) => {
  try {
    const result = await customer_model.history(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/courier_history", async (req, res) => {
  try {
    const result = await courier_model.courier_history(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/courier_deliveries", async (req, res) => {
  try {
    const result = await courier_model.courier_deliveries(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/delivered", async (req, res) => {
  try {
    const result = await courier_model.delivered(req.body);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
