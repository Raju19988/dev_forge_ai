import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

const PORT = 5001;
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "DevForge AI API is running"
  });
});

app.listen(PORT, () => {
  console.log(`DevForge AI API running on http://localhost:${PORT}`);
});
