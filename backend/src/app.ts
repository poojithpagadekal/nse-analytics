import express from "express";
const app = express();

app.use(express.json());
app.get("/health", (req, res) => {
  return res.json({ status: "ok" });
});

export default app;
