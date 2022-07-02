import cors from "cors";
import express from "express";
import routes from "./routes";
import cronJob from "./lib/cronJob";
import setupPassport from "../src/lib/passport";

setupPassport();
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/", routes);

app.listen(3001, () => {
  cronJob();
  console.log("🚀 Server ready at: http://localhost:3001");
});
