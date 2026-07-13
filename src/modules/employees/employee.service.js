const prisma = require("../../prismaClient");


const getAllEmployees = async (page, limit) => {
  let safeLimit = limit || 10;
  if (safeLimit > 50) {
    safeLimit = 50;
  }

  const skip = (page - 1) * safeLimit;

  const employees = await prisma.user.findMany({
    where: { role: "employee" },
    skip: skip,
    take: safeLimit,
    select: {
      id: true,
      name: true,
      email: true,
      salary: true,
      position: true,
      department: { select: { name: true } },
    },
  });

  const totalEmployees = await prisma.user.count({ where: { role: "employee" } });

  return {
    employees,
    totalEmployees,
    currentPage: page,
    totalPages: Math.ceil(totalEmployees / safeLimit),
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

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { departmentId, salary, position },
  });

  return updatedUser;
};

const getEmployeeById = async (id, requestingUser) => {
  const employee = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      email: true,
      salary: true,
      position: true,
      department: { select: { name: true } },
    },
  });

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  const isOwner = employee.id === requestingUser.id;
  const isAdmin = requestingUser.role === "admin";

  if (!isAdmin && !isOwner) {
    const error = new Error("You are not allowed to view this profile.");
    error.statusCode = 403;
    throw error;
  }

  return employee;
};

const updateEmployeeById = async (id, data) => {
  const employee = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  const updatedEmployee = await prisma.user.update({
    where: { id: Number(id) },
    data,
  });

  return updatedEmployee;
};

const deleteEmployee = async (id) => {
  const employee = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  // there's no separate employee row anymore, so this deletes the whole user account
  await prisma.user.delete({ where: { id: Number(id) } });
  return { message: "Employee deleted successfully." };
};

const getEmployeeSalary = async (id, requestingUser) => {
  const employee = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: { id: true, salary: true },
  });

  if (!employee) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  const isOwner = employee.id === requestingUser.id;
  const isAdmin = requestingUser.role === "admin";

  if (!isAdmin && !isOwner) {
    const error = new Error("You are not allowed to view this salary.");
    error.statusCode = 403;
    throw error;
  }

  return { salary: employee.salary };
};

module.exports = {getAllEmployees,createEmployee,getEmployeeById,updateEmployeeById,deleteEmployee,getEmployeeSalary};
