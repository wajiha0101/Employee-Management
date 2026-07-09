const express = require("express");
const router = express.Router();

const employeeController = require("./employee.controller");
const validate = require("../../middlewares/validate.middleware");
const { restrictToLoggedInUserOnly, restrictTo } = require("../../middlewares/auth.middleware");
const {createEmployeeSchema,updateEmployeeSchema,} = require("./employee.validation");

router.get("/",restrictToLoggedInUserOnly,restrictTo("admin"),employeeController.getAllEmployees);
router.post("/",restrictToLoggedInUserOnly,restrictTo("admin"),validate(createEmployeeSchema),employeeController.createEmployee);
router.get("/:id/salary",restrictToLoggedInUserOnly,employeeController.getEmployeeSalary);
router.get("/:id",restrictToLoggedInUserOnly,employeeController.getEmployeeById);
router.put("/:id",restrictToLoggedInUserOnly,restrictTo("admin"),validate(updateEmployeeSchema),employeeController.updateEmployeeById);
router.delete("/:id",restrictToLoggedInUserOnly,restrictTo("admin"),employeeController.deleteEmployee);

module.exports = router;