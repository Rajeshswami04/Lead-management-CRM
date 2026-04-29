const express = require("express");
const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  updateLeadStatus,
} = require("../controllers/leadController");

const router = express.Router();
const run = (controller) => (req, res, next) =>
  Promise.resolve(controller(req, res, next)).catch(next);

router.route("/").post(run(createLead)).get(run(getAllLeads));
router
  .route("/:id")
  .get(run(getLeadById))
  .put(run(updateLead))
  .delete(run(deleteLead));
router.patch("/:id/status", run(updateLeadStatus));

module.exports = router;
