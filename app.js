const express = require("express");
const app = express();

const config = require("./config.json");

//== connect to database
const mongoURI =
  config.MONGODB_URI || "mongodb://localhost:27017" + "/newsFeed";

let mongoose = require("mongoose");
const Leaderboard = require("./model");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("connected to database"));

const onePageArticleCount = 20;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("hello world!");
});

// your code here!
app.get("/topRankings", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10);
    let offset = parseInt(req.query.offset, 10);

    // defaults
    if (isNaN(limit)) limit = onePageArticleCount; // 20
    if (isNaN(offset)) offset = 0;

    // prevent negative values
    if (limit < 0) limit = onePageArticleCount;
    if (offset < 0) offset = 0;

    const result = await Leaderboard.find({})
      .skip(offset)
      .limit(limit)
      .lean();

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// ==end==

module.exports = { app, db };
