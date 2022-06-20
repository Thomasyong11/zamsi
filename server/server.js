import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import { readdirSync } from "fs"; // importing file system so that we don't have to import routes 1 by 1

const morgan = require("morgan");
require("dotenv").config();

const csrfProtection = csrf({ cookie: true });

// create express app

const app = express();

//db
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB Connection Error =>", err));

// apply middlewares
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser()); // for csrf token
app.use(morgan("dev"));

//route
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

//csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
//port

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
