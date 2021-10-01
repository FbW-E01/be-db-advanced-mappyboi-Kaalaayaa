import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import requestlogger from "./middleware/requestlogger.js";
import mongoose from "mongoose"
import Report from "./models/report.js"

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(requestlogger);


const connectionString = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:27017/exampledb`

mongoose.connection.on('error',         e => console.log(">> Error!", e) || process.exit(0));
mongoose.connection.on('connecting',    () => console.log(">> Connecting"));
mongoose.connection.on('disconnecting', () => console.log(">> Disconnecting"));
mongoose.connection.on('disconnected',  () => console.log(">> Disconnected"));



app.get("/notifications", (req, res) => {
  // Somehow load data from DB
  res.json([]);
});

app.post("/notifications", (req, res) => {
  const result = req.body
  console.log("Received");
  
 mongoose.connect(connectionString) 
 
 const report = new Report(result)

 report.save()
    .then(() => {
      console.log("Report saved" )
      res.status(201);
      res.json({ success: true });
    })
    .catch((error)=> {
      console.log("Error connecting to MongoDB", error);
      res.status(500);
      res.json({ success: false, error: "Connection error!" });
    })
    .finally(() => {
      mongoose.connection.close();
    });
  
  
});

app.use((req, res) => {
  res.status(404);
  res.send("I don't have what you seek");
});

app.listen(process.env.PORT, () => {
  console.info(`App listening on http://localhost:${process.env.PORT}`);
});
