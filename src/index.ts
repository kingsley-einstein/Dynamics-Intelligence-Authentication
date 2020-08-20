import express from "express";
import mongoose from "mongoose";
import configure from "./config";
import { Environment } from "./env";

const app: express.Application = express();
const port: number = parseInt(process.env.PORT || "4000");

configure(app);

app.listen(port, async () => {
 console.log(`Server running on ${port}`);

 // Connect to mongodb
 const m = await mongoose.connect(Environment.DB[process.env.NODE_ENV], {
  useNewUrlParser: true,
  useCreateIndex: true
 });

 // Check if connected
 if (m) 
  console.log("Connected to mongodb");
});

export default app;
