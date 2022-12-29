const express = require("express");
const app = express();
const port = 3001;

const bazki_model = require("./bazki_model");
const inicjalizacja = require("./inicjalizacja_model");

inicjalizacja.initialize().then(() => {
  bazki_model
    .authenticate("cookie_monster_11", "cookies")
    .then((result) => console.log(result));
});

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

app.get("/", async (req, res) => {
  // try {
  //   const merchants = await bazki_model.checkIfTableExists();
  //   res.status(200).send(merchants);
  // } catch (e) {
  //   console.error(e);
  //   res.status(500).send(e);
  // }

  try {
    const merchants = await bazki_model.getMerchants();
    res.status(200).send(merchants);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
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

// app.get("/", async (req, res) => {
//   try {
//     const merchants = await bazki_model.getMerchants();
//     res.status(200).send(merchants);
//   } catch (e) {
//     console.error(e);
//     res.status(500).send(e);
//   }

//   // bazki_model
//   //   .getMerchants()
//   //   .then((response) => {
//   //     res.status(200).send(response);
//   //   })
//   //   .catch((error) => {
//   //     res.status(500).send(error);
//   //   });
// });

app.post("/merchants", (req, res) => {
  bazki_model
    .createMerchant(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.delete("/merchants/:id", (req, res) => {
  bazki_model
    .deleteMerchant(req.params.id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
