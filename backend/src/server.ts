import app from "./app";

const PORT = Number(process.env.PORT) || 5001;

app.listen(PORT, () => {
  console.log(`DevForge AI API running on http://localhost:${PORT}`);
});