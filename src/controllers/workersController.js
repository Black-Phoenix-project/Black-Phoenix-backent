const Worker = require("../models/Workers");


// CREATE
exports.createWorker = async (req, res) => {
  try {
    const worker = await Worker.create(req.body);

    res.status(201).json({
      success: true,
      data: worker,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// GET ALL
exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().lean();

    res.json({
      success: true,
      count: workers.length,
      data: workers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET ONE
exports.getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker)
      return res.status(404).json({ message: "Worker not found" });

    res.json({
      success: true,
      data: worker,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE
exports.updateWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!worker)
      return res.status(404).json({ message: "Worker not found" });

    res.json({
      success: true,
      data: worker,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// DELETE
exports.deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);

    if (!worker)
      return res.status(404).json({ message: "Worker not found" });

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET BY DEPARTMENT
exports.getWorkersByDepartment = async (req, res) => {
  try {
    const workers = await Worker.find({
      department: req.params.department,
    });

    res.json({
      success: true,
      count: workers.length,
      data: workers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
