import Express from "express";
import dotenv from "dotenv";
import router from "./controllers";
import mongoose from "mongoose";
dotenv.config();

const app = Express();

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
