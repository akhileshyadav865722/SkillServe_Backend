const express = require("express");
const router = express.Router();
const {
  createService,
  getAllServices,
  applyForRole,
  getMyServices,
  getServiceApplications,
  updateApplicationStatus,
} = require("../controller/servicecontroller");

const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createService);
router.get("/", getAllServices);
router.get("/my-services", verifyToken, getMyServices);
router.get("/:serviceId/applications", verifyToken, getServiceApplications);
router.post("/:serviceId/apply/:roleId", verifyToken, applyForRole);
router.patch(
  "/:serviceId/role/:roleId/applicant/:applicantId",
  verifyToken,
  updateApplicationStatus
);

module.exports = router;
