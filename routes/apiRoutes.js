const express = require("express");
const app = express();
const productRoutes = require("./productRoutes");
const settingsRoutes = require("./settingsRouts");
const categoryRoutes = require("./categoryRoutes");
const userRoutes = require("./userRoutes");
const orderRoutes = require("./orderRoutes");

const jwt = require("jsonwebtoken");

app.get("/logout", (req, res) => {
  return res.clearCookie("access_token").send("access token cleared");
});

app.get("/get-token", (req, res) => {
  console.log(req, "get auth req");

  try {
    const accessToken = req.accessToken;
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    return res.json({ token: decoded.name, role: decoded.role });
  } catch (err) {
    return res.status(401).send("Unauthorized. Invalid Token");
  }
});

app.get("/get-token", (req, res) => {
  console.log(req, "get auth req");

  try {
    const accessToken = req.accessToken;
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    return res.json({ token: decoded.name, role: decoded.role });
  } catch (err) {
    return res.status(401).send("Unauthorized. Invalid Token");
  }
});

app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);
app.use("/settings", settingsRoutes);

module.exports = app;
