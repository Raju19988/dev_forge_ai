import express from "express";
import cors from "cors";

import { requestLogger } from "./middleware/requestLogger";
import v1Routes from "./routes/v1";

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use("/api/v1", v1Routes);

export default app;