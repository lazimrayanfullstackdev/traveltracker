import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

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

db.connect();
db.query("SELECT * FROM visited_countries", async(err, res)=>{
  if(err){
    console.log("Error Fetching Data");
  }else{
    Countries = res.rows.map(row=>row.country_code);
    console.log("Countries are: "+ Countries);
    totalCountry = Countries.length;
  }
  db.end();
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.render("index.ejs", {
    countries : Countries,
    total : totalCountry
  })
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
