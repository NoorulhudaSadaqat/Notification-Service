const app = require("express")();
require("express-async-errors");
const helmet = require("helmet");
const dotenv = require("dotenv").config();
const cors = require("cors");
const config = require("config");
const debug = require("debug")("notificationApp");
const routes = require("./src/routes/index.js");
const connectDB = require("./startup/mongoDb.js");
const errorMiddleware = require("./src/middlewares/error.js");
const swaggerConfig = require("./startup/swagger.js");

app.use(cors({ origin: "*" }));
app.use(helmet());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "traceid, Content-Type");
  next();
});

connectDB();

const port = config.get("server.port") || 4000;

const bodyParser = require("express").json;
app.use(bodyParser({ limit: "50mb" }));

app.use("/api/v1", routes);
app.use(errorMiddleware);

swaggerConfig(app);

app.listen(port, () => {
  debug("server is running on port : ", port);
});
