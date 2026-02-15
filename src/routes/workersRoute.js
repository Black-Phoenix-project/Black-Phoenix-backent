const express = require("express");
const router = express.Router();
const WorkerController = require("../controllers/workersController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Worker:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - position
 *         - salary
 *       properties:
 *        
 *         firstname:
 *           type: string
 *           description: Worker's first name
 *         lastname:
 *           type: string
 *           description: Worker's last name
 *         position:
 *           type: string
 *           description: Worker's job position
 *         department:
 *           type: string
 *           description: Department of the worker
 *         salary:
 *           type: number
 *           description: Worker's salary
 *         phone:
 *           type: string
 *           description: Contact phone number
 *         avatar:
 *           type: string
 *           description: URL of worker's avatar image
 *  
 *       example:
 *        
 *         firstname: John
 *         lastname: Doe
 *         position: Software Engineer
 *         department: IT
 *         salary: 75000
 *         phone: "+1234567890"
 *         avatar: "https://example.com/avatar.jpg"
 *        
 */

/**
 * @swagger
 * tags:
 *   name: Workers
 *   description: Worker management API
 */

// GET all workers
/**
 * @swagger
 * /api/workers:
 *   get:
 *     summary: Get all workers
 *     tags: [Workers]
 *     responses:
 *       200:
 *         description: List of all workers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Worker'
 *       500:
 *         description: Server error
 */
router.get("/", WorkerController.getAllWorkers);

// GET workers by department
/**
 * @swagger
 * /api/workers/department/{department}:
 *   get:
 *     summary: Get workers by department
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: department
 *         schema:
 *           type: string
 *         required: true
 *         description: Department name
 *         example: IT
 *     responses:
 *       200:
 *         description: List of workers in the department
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Worker'
 *       500:
 *         description: Server error
 */
router.get("/department/:department", WorkerController.getWorkersByDepartment);

// GET one worker
/**
 * @swagger
 * /api/workers/{id}:
 *   get:
 *     summary: Get worker by ID
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Worker ID
 *     responses:
 *       200:
 *         description: Worker details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Worker'
 *       404:
 *         description: Worker not found
 *       500:
 *         description: Server error
 */
router.get("/:id", WorkerController.getWorkerById);

// CREATE a new worker
/**
 * @swagger
 * /api/workers:
 *   post:
 *     summary: Create a new worker
 *     tags: [Workers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Worker'
 *     responses:
 *       201:
 *         description: Worker created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Worker'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", WorkerController.createWorker);

// UPDATE worker by ID
/**
 * @swagger
 * /api/workers/{id}:
 *   put:
 *     summary: Update worker by ID
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Worker ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Worker'
 *     responses:
 *       200:
 *         description: Worker updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Worker'
 *       404:
 *         description: Worker not found
 *       500:
 *         description: Server error
 */
router.put("/:id", WorkerController.updateWorker);

// DELETE worker by ID
/**
 * @swagger
 * /api/workers/{id}:
 *   delete:
 *     summary: Delete worker by ID
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Worker ID
 *     responses:
 *       200:
 *         description: Worker deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Worker not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", WorkerController.deleteWorker);

module.exports = router;
