const express = require("express");
const router = express.Router();
const WorkerController = require("../controllers/workersController");

router.get("/", WorkerController.getAllWorkers);

router.get("/department/:department", WorkerController.getWorkersByDepartment);

router.get("/:id", WorkerController.getWorkerById);

router.post("/", WorkerController.createWorker);

router.put("/:id", WorkerController.updateWorker);

router.delete("/:id", WorkerController.deleteWorker);

module.exports = router;
