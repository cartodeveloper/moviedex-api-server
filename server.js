require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const MOVIES = require("./movies-data-small.json");
console.log(process.env.API_TOKEN);
const app = express();

app.use(morgan("dev"));

// Validate Token
app.use(
  (validateBearerToken = (req, res, next) => {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get("Authorization");

    if (!authToken || authToken.split(" ")[1] !== apiToken) {
      return res.status(401).json({ error: "Unauthorized Request" });
    }
    // move to the next middleware.
    next();
  })
);

// Movie Route & Filter
app.get(
  "/movie",
  (handleGetMovie = (req, res) => {
    let response = MOVIES;

    // GENRE FILTER
    if (req.query.genre) {
      response = response.filter((movie) =>
        movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
      );
    }

    // COUNTRY FILTER
    if (req.query.country) {
      response = response.filter((movie) => {
        return movie.country
          .toLowerCase()
          .includes(req.query.country.toLowerCase());
      });
    }

    // AVG VOTE FILTER
    if (req.query.avg_vote) {
      response = response.filter((movie) => {
        return Number(movie.avg_vote >= Number(req.query.avg_vote));
      });
    }

    res.json(response);
  })
);

// Dinamic Port or 8000 default
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
