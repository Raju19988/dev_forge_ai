import express from "express";
import cors from "cors";

import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import v1Routes from "./routes/v1";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json({ limit: "10kb" }));

app.use(requestLogger);

app.use("/api/v1", v1Routes);

app.use(errorHandler);

export default app;