const { z } = require("zod");

const createEmployeeSchema = z.object({
  userId: z.number({ required_error: "userId is required" }),
  departmentId: z.number().optional(),
  salary: z.number({ required_error: "Salary is required" }).positive("Salary must be positive"),
  position: z.string().min(2, "Position must be at least 2 characters"),
});

const updateEmployeeSchema = z.object({
  departmentId: z.number().optional(),
  salary: z.number().positive("Salary must be positive").optional(),
  position: z.string().min(2, "Position must be at least 2 characters").optional(),
});

module.exports = {createEmployeeSchema,updateEmployeeSchema};