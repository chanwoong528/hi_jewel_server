//@ts-nocheck

process.env.NODE_ENV === "dev"
  ? require("dotenv").config({ path: "./env/dev.env" })
  : require("dotenv").config({ path: "./env/prod.env" });

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const postgresDb = require("./Model/postgres.index");


const app = express();
const PORT = process.env.PORT || 5002;



app.use(
  cors({
    origin: [process.env.PROXY_SERVER_URL],
    credentials: true,
    methods: ["HEAD", "POST", "PUT", "GET", "PATCH", "DELETE"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

//-- Controller Inject --
// app.use(
//   API_BASE_URL_TYPE.publicBaseUrl + "/category",
//   require("./domain/Category/CategoryController")
// );

//-- Controller Inject --

// DB Connection
postgresDb.sequelize
  .sync()
  .then((dbInfo) => {
    console.log(`PostgresDB connected: ${dbInfo.config.host}`);
  })
  .catch((error) => {
    console.warn("postgresDb connection Error: ", error);
  });
// DB Connection

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Unable to run Server on ${PORT}=> ${err}`);
  } else {
    console.log(`Server Up: ${PORT}`);
  }
});
