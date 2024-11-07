const express = require("express");
const { getCompanyInfo, updateCompanyInfo } = require("../controllers/companyInfoController");
const { verifyToken, checkRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyToken, checkRole("admin"), getCompanyInfo);
router.put("/", verifyToken, checkRole("admin"), updateCompanyInfo);

module.exports = router;
