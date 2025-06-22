import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.js";
import formParser from "./routes/formParser.js";


const app = express();
app.use(cors());
app.use("/", uploadRoutes);
app.use("/", formParser);

app.listen(3001, () => console.log("Backend running at 3001 port"));
