const express = require("express");
const { 
  createSite, 
  getAllSites, 
  getSiteById, 
  updateSite, 
  deleteSite 
} = require("../controllers/siteController");
const { verifyToken, checkRole } = require("../middleware/auth");

const router = express.Router();

router.post("/create", verifyToken, checkRole("admin"), createSite);
router.get("/", verifyToken, checkRole("admin"), getAllSites);
router.get("/:id", getSiteById);
router.put("/modify/:id", verifyToken, checkRole("admin"), updateSite);
router.delete("/delete/:id", verifyToken, checkRole("admin"), deleteSite);

module.exports = router;
