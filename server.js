const express = require("express");
const path = require("path");
const { readEmployees, writeEmployees } = require('./modules/file-handler');

const app = express();
const PORT = 8001;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
    try {
        const employees = await readEmployees();
        res.render("index", { employees });
    } catch (err) {
        console.error(err);
        res.send("Error loading employees");
    }
});

app.get("/register", (req, res) => {
    res.render("add");
});

app.post("/register", async (req, res) => {
    try {
        const { name, department, salary } = req.body;

        if (!name || !department || !salary || name.trim() === '' || department.trim() === '' || isNaN(salary) || salary < 0) {
            return res.send("Invalid input: Name and department cannot be empty, salary must be a positive number.");
        }

        const employees = await readEmployees();

        const newEmployee = {
            id: Date.now(),
            name: name.trim(),
            department: department.trim(),
            salary: Number(salary)
        };

        employees.push(newEmployee);

        await writeEmployees(employees);

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error registering employee");
    }
});

app.get("/edit/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const employees = await readEmployees();
        const employee = employees.find(emp => emp.id === id);

        if (!employee) return res.send("Employee not found");

        res.render("edit", { employee });
    } catch (err) {
        console.error(err);
        res.send("Error loading employee");
    }
});

app.post("/update/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, department, salary } = req.body;

        if (!name || !department || !salary || name.trim() === '' || department.trim() === '' || isNaN(salary) || salary < 0) {
            return res.send("Invalid input: Name and department cannot be empty, salary must be a positive number.");
        }

        const employees = await readEmployees();

        const updatedEmployees = employees.map(emp =>
            emp.id === id ? { ...emp, name: name.trim(), department: department.trim(), salary: Number(salary) } : emp
        );

        await writeEmployees(updatedEmployees);

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error updating employee");
    }
});

app.get("/delete/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const employees = await readEmployees();
        const filteredEmployees = employees.filter(emp => emp.id !== id);

        await writeEmployees(filteredEmployees);

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error deleting employee");
    }
});

app.listen(PORT, async () => {
    try {
        const employees = await readEmployees();
        console.log("Employee data:", employees);
        console.log(`Server running on http://localhost:${PORT}`);
    } catch (err) {
        console.error("Error loading employee data on startup:", err);
    }
});


