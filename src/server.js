require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const employeeRoutes = require("./modules/employees/employee.routes");
const departmentRoutes = require("./modules/departments/department.routes");

const app = express();

app.use(cors({ origin: true, credentials: true })); 
app.use(express.json());
app.use(cookieParser());


app.use("/auth", authRoutes);
app.use("/employees", employeeRoutes);
app.use("/departments", departmentRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "HR Module API is running." });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});