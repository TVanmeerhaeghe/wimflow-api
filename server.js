const express = require("express");
const app = express();
const cors = require('cors');
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const maintenanceRoutes = require("./routes/maintenance/maintenance");
const siteRoutes = require("./routes/sites");
const noteRoutes = require("./routes/maintenance/notes");
const clientRoutes = require("./routes/clients");
require("./cronJob");
require("./models/associations");

// Load environment variables
dotenv.config();

app.use(cors({ origin: 'http://localhost:8080' }));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/site", siteRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/client", clientRoutes);

console.log(new Date());

// Sync database and start server
sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully");
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });
