// this file is for express!

require("dotenv").config();

const PORT = 3000;
const express = require("express");
const server = express();

// installing Morgan (before body-logging middleware)
const morgan = require("morgan");
server.use(morgan("dev"));
// The first, morgan('dev'), is a function which logs out the incoming requests

server.use(express.json());

const apiRouter = require("./api");
server.use("/api", apiRouter);

// ------- example below -----
// server.use tells the server to always call this function

const { client } = require("./db");
client.connect();

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

// ------- example below -- assume someone made a GET request to /api -----

// app.use("/api", (req, res, next) => {
//   console.log("A request was made to /api");
//   next();
// });

// app.get("/api", (req, res, next) => {
//   console.log("A get request was made to /api");
//   res.send({ message: "success" });
// });
