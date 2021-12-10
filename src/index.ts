import Express from "express";
import dotenv from "dotenv";
import router from "./controllers";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app = Express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(router);

app.get("/health", () => {
  console.log("Application is running well");
});

mongoose
  .connect(process.env.DB_URL ?? "mongodb://localhost:27017/bbc-backend")
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log(err);
    process.exit(-1);
  });

app.listen(process.env.PORT, () => {
  console.log("Application running");
});
