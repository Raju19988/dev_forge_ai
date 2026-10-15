import express from "express";
import cors from "cors";

import { requestLogger } from "./middleware/requestLogger";
import healthRoutes from "./routes/health.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use("/api", healthRoutes);

export default app;