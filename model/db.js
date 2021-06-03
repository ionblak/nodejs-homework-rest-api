const mongoose = require("mongoose");

require("dotenv").config();
let uriDb = null;
if (process.env.NODE_ENV === "test") {
  uriDb = process.env.URI_DB_TEST;
} else {
  uriDb = process.env.URI_DB;
}

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  poolSize: 5,
});

mongoose.connection.on("connected", () => {
  console.log("Database connection successful");
});

mongoose.connection.on("error", (err) => {
  console.log(`Database connection error : ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Database disconnected");
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Disconnected MongoDB");
    process.exit(1);
  });
});

module.exports = db;
