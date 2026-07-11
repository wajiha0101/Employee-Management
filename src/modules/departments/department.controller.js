const departmentService = require("./department.service");

const getAllDepartments = async (req, res) => {
  try {
    const departments = await departmentService.getAllDepartments();
    return res.status(200).json({
      message: "Departments fetched successfully.",
      data: departments,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Something went wrong.",
    });
  }
};

const createDepartment = async (req, res) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    return res.status(201).json({
      message: "Department created successfully.",
      data: department,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Something went wrong.",
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    if (!Number.isInteger(Number(req.params.id))) {
      return res.status(400).json({ message: "Invalid ID." });
    }
    const department = await departmentService.updateDepartment(req.params.id, req.body);
    return res.status(200).json({
      message: "Department updated successfully.",
      data: department,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Something went wrong.",
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    if (!Number.isInteger(Number(req.params.id))) {
      return res.status(400).json({ message: "Invalid ID." });
    }
    const result = await departmentService.deleteDepartment(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Something went wrong.",
    });
  }
};

module.exports = {getAllDepartments,createDepartment,updateDepartment,deleteDepartment};