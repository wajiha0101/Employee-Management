const prisma = require("../../prismaClient");


const getAllEmployees = async (page, limit) => {
  const skip = (page - 1) * limit;

  const employees = await prisma.employee.findMany({
    skip: skip,
    take: limit,
    include: {
      user: { select: { name: true, email: true } },
      department: { select: { name: true } },
    },
  });

  const totalEmployees = await prisma.employee.count();

  return {
    employees,
    totalEmployees,
    currentPage: page,
    totalPages: Math.ceil(totalEmployees / limit),
  };
};

const createEmployee = async (data) => {
  const { userId, departmentId, salary, position } = data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const error = new Error("No user found with this userId.");
    error.statusCode = 404;
    throw error;
  }

  const existingEmployee = await prisma.employee.findUnique({ where: { userId } });
  if (existingEmployee) {
    const error = new Error("This user already has an employee profile.");
    error.statusCode = 400;
    throw error;
  }

  const employee = await prisma.employee.create({
    data: { userId, departmentId, salary, position },
  });

  return employee;
};

const getEmployeeById = async (id, requestingUser) => {
  const employee = await prisma.employee.findUnique({
    where: { id: Number(id) },
    include: {
      user: { select: { name: true, email: true } },
      department: { select: { name: true } },
    },
  });

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  const isOwner = employee.userId === requestingUser.id;
  const isAdmin = requestingUser.role === "admin";

  if (!isAdmin && !isOwner) {
    const error = new Error("You are not allowed to view this profile.");
    error.statusCode = 403;
    throw error;
  }

  return employee;
};

const updateEmployeeById = async (id, data) => {
  const employee = await prisma.employee.findUnique({ where: { id: Number(id) } });
  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  const updatedEmployee = await prisma.employee.update({
    where: { id: Number(id) },
    data,
  });

  return updatedEmployee;
};

const deleteEmployee = async (id) => {
  const employee = await prisma.employee.findUnique({ where: { id: Number(id) } });
  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  await prisma.employee.delete({ where: { id: Number(id) } });
  return { message: "Employee deleted successfully." };
};

const getEmployeeSalary = async (id, requestingUser) => {
  const employee = await prisma.employee.findUnique({
    where: { id: Number(id) },
    select: { userId: true, salary: true },
  });

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  const isOwner = employee.userId === requestingUser.id;
  const isAdmin = requestingUser.role === "admin";

  if (!isAdmin && !isOwner) {
    const error = new Error("You are not allowed to view this salary.");
    error.statusCode = 403;
    throw error;
  }

  return { salary: employee.salary };
};

module.exports = {getAllEmployees,createEmployee,getEmployeeById,updateEmployeeById,deleteEmployee,getEmployeeSalary};