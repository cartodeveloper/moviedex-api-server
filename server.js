require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const MOVIES = require("./movies-data-small.json");

const app = express();
app.use(morgan("dev"));
// This will help with security purposes.
app.use(helmet());
//Cross-Origin Resource Sharing, contains an express middleware we can use that will add headers to responses when appropriate.
app.use(cors());

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
  (getMovie = (req, res) => {
    let response = MOVIES;
    const { genre, country, avg_vote } = req.query;

    // Genre filter
    if (genre) {
      response = response.filter((movie) =>
        movie.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }

    // Country filter
    if (country) {
      response = response.filter((movie) => {
        return movie.country.toLowerCase().includes(country.toLowerCase());
      });
    }

    // Avg vote filter
    if (avg_vote) {
      response = response.filter((movie) => {
        return Number(movie.avg_vote >= Number(avg_vote));
      });
    }

    res.json(response);
  })
);


const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
