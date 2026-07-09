const express = require("express");
const router = express.Router();

const departmentController = require("./department.controller");
const validate = require("../../middlewares/validate.middleware");
const { restrictToLoggedInUserOnly, restrictTo } = require("../../middlewares/auth.middleware");
const {createDepartmentSchema,updateDepartmentSchema} = require("./department.validation");


router.get("/",restrictToLoggedInUserOnly,restrictTo("admin"),departmentController.getAllDepartments);

router.post("/",restrictToLoggedInUserOnly,restrictTo("admin"),validate(createDepartmentSchema),departmentController.createDepartment);

router.put("/:id",restrictToLoggedInUserOnly,restrictTo("admin"),validate(updateDepartmentSchema),departmentController.updateDepartment);

router.delete("/:id",restrictToLoggedInUserOnly,restrictTo("admin"),departmentController.deleteDepartment);

module.exports = router;