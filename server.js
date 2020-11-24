require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
console.log(process.env.API_TOKEN);
const app = express();

app.use(morgan("dev"));

// Validate Token
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized Request" });
  }
  // move to the next middleware.
  next();
});
