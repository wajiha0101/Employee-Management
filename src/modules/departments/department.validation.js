const { z } = require("zod");

const createDepartmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
});

const updateDepartmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
});

module.exports = {createDepartmentSchema,updateDepartmentSchema};