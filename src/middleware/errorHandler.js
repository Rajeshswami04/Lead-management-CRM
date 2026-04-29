const errorHandler = (error, _req, res, _next) => {
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");

    return res.status(400).json({ error: message });
  }

  if (error.code === 11000) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  return res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
