const express = require("express");

//db connection
// const con = require("./config/dbConnection");
const cors = require("cors");

const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5001;

app.use(cors());

app.use(express.json());
app.use("/", require("./routes/crudRoutes.js"));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
