const employeeService = require("./employee.service");

const getAllEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await employeeService.getAllEmployees(page, limit);

    return res.status(200).json({
      message: "Employees fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Something went wrong.",
    });
  }
};

const createEmployee = async (req, res) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    return res.status(201).json({
      message: "Employee created successfully.",
      data: employee,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Something went wrong.",
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id, req.user);
    return res.status(200).json({
      message: "Employee fetched successfully.",
      data: employee,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Something went wrong.",
    });
  }
};

const updateEmployeeById = async (req, res) => {
  try {
    const employee = await employeeService.updateEmployeeById(req.params.id, req.body, req.user);
    return res.status(200).json({
      message: "Employee updated successfully.",
      data: employee,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Something went wrong.",
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const result = await employeeService.deleteEmployee(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Something went wrong.",
    });
  }
};

const getEmployeeSalary = async (req, res) => {
  try {
    const result = await employeeService.getEmployeeSalary(req.params.id, req.user);
    return res.status(200).json({
      message: "Salary fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Something went wrong.",
    });
  }
};

module.exports = {getAllEmployees,createEmployee,getEmployeeById,updateEmployeeById,deleteEmployee,getEmployeeSalary};