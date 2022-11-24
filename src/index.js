const express = require("express");
const { mongoConnect } = require("./config/database.config");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();

app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  mongoConnect()
    .then((res) => console.log(`Connect to MongoDB success!`))
    .catch((err) => {
        throw new Error(`An error occurs! Error :${err}`)});
});
