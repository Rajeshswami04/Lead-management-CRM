const mongoose = require("mongoose");
const { Lead, allowedStatuses } = require("../models/Lead");

const statusRules = {
  NEW: ["CONTACTED", "LOST"],
  CONTACTED: ["QUALIFIED", "LOST"],
  QUALIFIED: ["CONVERTED", "LOST"],
  CONVERTED: [],
  LOST: [],
};

const isValidLeadId = (leadId) => mongoose.Types.ObjectId.isValid(leadId);

const canChangeStatus = (currentStatus, newStatus) => {
  const allowedNextStatuses = statusRules[currentStatus] || [];
  return allowedNextStatuses.includes(newStatus);
};

const createNotFoundError = () => {
  const error = new Error("Lead not found");
  error.statusCode = 404;
  return error;
};

const checkLeadId = (leadId) => {
  if (!isValidLeadId(leadId)) {
    const error = new Error("Invalid lead ID");
    error.statusCode = 400;
    throw error;
  }
};

const createLead = async (req, res) => {
  const newLead = await Lead.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    source: req.body.source,
  });

  res.status(201).json(newLead);
};

const getAllLeads = async (req, res) => {
  const statusFilter = req.query.status;
  const query = {};

  if (statusFilter) {
    if (!allowedStatuses.includes(statusFilter)) {
      return res.status(400).json({ error: "Invalid status filter" });
    }

    query.status = statusFilter;
  }

  const leads = await Lead.find(query).sort({ createdAt: -1 });
  res.json(leads);
};

const getLeadById = async (req, res) => {
  const leadId = req.params.id;
  checkLeadId(leadId);

  const lead = await Lead.findById(leadId);

  if (!lead) {
    throw createNotFoundError();
  }

  res.json(lead);
};

const updateLead = async (req, res) => {
  const leadId = req.params.id;
  checkLeadId(leadId);

  if (Object.prototype.hasOwnProperty.call(req.body, "status")) {
    return res.status(400).json({
      error: "Status updates must be made through PATCH /leads/:id/status",
    });
  }

  const updatedLead = await Lead.findByIdAndUpdate(
    leadId,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      source: req.body.source,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedLead) {
    return res.status(404).json({ error: "Lead not found" });
  }

  res.json(updatedLead);
};

const deleteLead = async (req, res) => {
  const leadId = req.params.id;
  checkLeadId(leadId);

  const deletedLead = await Lead.findByIdAndDelete(leadId);

  if (!deletedLead) {
    return res.status(404).json({ error: "Lead not found" });
  }

  res.json({ message: "Lead deleted successfully" });
};

const updateLeadStatus = async (req, res) => {
  const leadId = req.params.id;
  const newStatus = req.body.status;

  checkLeadId(leadId);

  if (!newStatus || !allowedStatuses.includes(newStatus)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const lead = await Lead.findById(leadId);

  if (!lead) {
    throw createNotFoundError();
  }

  if (lead.status === newStatus) {
    return res.status(400).json({ error: "Lead is already in this status" });
  }

  if (!canChangeStatus(lead.status, newStatus)) {
    return res.status(400).json({
      error: `Invalid status transition from ${lead.status} to ${newStatus}`,
    });
  }

  lead.status = newStatus;
  await lead.save();

  res.json(lead);
};

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  updateLeadStatus,
};
