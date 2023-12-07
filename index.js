import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import ejs from "ejs";

const app = express();
const port = 3000;

let totalCountry = 0;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Lazimrayan99*",
  port: 5433
});

let Countries = [];

// Function to fetch countries from the database
const fetchCountries = async () => {
  try {
    const result = await db.query("SELECT * FROM visited_countries");
    Countries = result.rows.map(row => row.country_code);
    totalCountry = Countries.length;
  } catch (err) {
    console.log("Error Fetching Data:", err);
  }
};

db.connect();
fetchCountries(); // Fetch countries on startup

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.render("index.ejs", {
    countries: Countries,
    total: totalCountry
  });
});

app.post("/add", async (req, res) => {
  const userCountry1 = req.body.country.trim();
  const userCountry = userCountry1.charAt(0).toUpperCase() + userCountry1.slice(1);

  try {
    const result = await db.query("SELECT country_code FROM countries WHERE country_name = $1", [userCountry]);

    if (result.rows.length !== 0) {
      const data = result.rows[0];
      const countryCode = data.country_code;

      await db.query("INSERT INTO visited_countries(country_code) VALUES ($1)", [countryCode]);

      // After insertion, fetch the updated data
      await fetchCountries();

      res.redirect("/");
    } else {
      console.log("Country Not Matched");
      res.redirect("/");
    }
  } catch (err) {
    console.error("Error executing query:", err);
    res.redirect("/");
  }
});

process.on('SIGINT', async () => {
  await db.end();
  process.exit();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
