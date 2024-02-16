require("dotenv").config();
const { connectDB } = require("./src/clients/db");
const express = require("express");
const Boom = require("boom");
const cors = require("cors");
const { limiter } = require("./src/clients/rate-limiter");
const { routes } = require("./src/routes/index");

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(limiter());//loi
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);//loi

app.use((err, req, res, next) => {
  // console.error(err);
  console.log(err);

  if (err) {
    //sd err.isBoom de kiem tra neu la loi Boom
    if (err.isBoom) {
      return res.status(err.output.statusCode || 500).json(err.output.payload);
    }

    return res.status(500).json({ messae: "internal server error" });
  }
});

app.get("/", (req, res) => res.send("hello world!"));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running in port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("err =>", err);
  });
