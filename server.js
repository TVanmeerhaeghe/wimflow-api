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
const estimateRoutes = require("./routes/estimate/estimate");
const estimateTaskRoutes = require("./routes/estimate/estimateTask");
const companyInfoRoutes = require("./routes/companyInfo");
const invoiceRoutes = require("./routes/invoice/invoice");
const invoiceTaskRoutes = require("./routes/invoice/invoiceTask");
const projectRoutes = require("./routes/project/project");
const projectTaskRoutes = require("./routes/project/projectTask");
const projectFileRoutes = require("./routes/project/projectFile")
require("./cronJob");
require("./models/associations");

dotenv.config();

app.use(cors({ origin: 'http://localhost:8080' }));

app.use(express.json({ limit: '10mb' }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/site", siteRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/estimate", estimateRoutes);
app.use("/api/estimate-task", estimateTaskRoutes);
app.use("/api/company-info", companyInfoRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/invoice-task", invoiceTaskRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/project/project-task", projectTaskRoutes);
app.use("/api/project/project-file", projectFileRoutes);

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
