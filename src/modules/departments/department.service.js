const prisma = require("../../prismaClient");

const getAllDepartments = async () => {
  const departments = await prisma.department.findMany({
    include: {
      employees: {
        select: { id: true, position: true },
      },
    },
  });

  return departments;
};

const createDepartment = async (data) => {
  const { name } = data;

  const existingDepartment = await prisma.department.findUnique({ where: { name } });
  if (existingDepartment) {
    const error = new Error("A department with this name already exists.");
    error.statusCode = 400;
    throw error;
  }

  const department = await prisma.department.create({ data: { name } });
  return department;
};

const updateDepartment = async (id, data) => {
  const department = await prisma.department.findUnique({ where: { id: Number(id) } });
  if (!department) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }

  const updatedDepartment = await prisma.department.update({
    where: { id: Number(id) },
    data,
  });

  return updatedDepartment;
};

const deleteDepartment = async (id) => {
  const department = await prisma.department.findUnique({ where: { id: Number(id) } });
  if (!department) {
    const error = new Error("Department not found.");
    error.statusCode = 404;
    throw error;
  }

  await prisma.department.delete({ where: { id: Number(id) } });
  return { message: "Department deleted successfully." };
};

module.exports = {getAllDepartments,createDepartment,updateDepartment,deleteDepartment};