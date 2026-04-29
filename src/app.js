const express = require("express");
const leadRoutes = require("./routes/leadRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Lead Management CRM API is running" });
});

app.use("/leads", leadRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
});

app.use(errorHandler);

module.exports = app;
