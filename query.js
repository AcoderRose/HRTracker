require("dotenv").config(); // configuration settings from the .env file loaded

const { Pool } = require("pg"); // postgreSQL pool imported

// create a new database connection pool instance with specified connection details.
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
});

// view all departments function
const viewDepartments = async () => {
  try {
    const res = await pool.query("SELECT * FROM department"); // all departments gotten from ran query
    return res.rows; // results returned
  } catch (err) {
    console.error("Query execution error", err.stack); // errors logged
  }
};

// view all roles function
const viewRoles = async () => {
  try {
    const res = await pool.query(
      "SELECT r.id, r.title, r.salary, d.name AS department FROM role r JOIN department d ON r.department_id = d.id"
    ); // all roles gotten from ran query
    return res.rows;
  } catch (err) {
    console.error("Query execution error", err.stack);
  }
};

// view all employees function
const viewEmployees = async () => {
  try {
    const res = await pool.query(`
      SELECT e.id, e.first_name, e.last_name, r.title AS role, r.salary, d.name AS department,
             COALESCE(m.first_name || ' ' || m.last_name, 'No manager') AS manager
      FROM employee e
      LEFT JOIN role r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
    `);
    return res.rows; // results returned
  } catch (err) {
    console.error("Query execution error", err.stack); // errors logged
  }
};

// view all managers function
const viewManagers = async () => {
  try {
    const res =
      await pool.query(`SELECT DISTINCT m.first_name || ' ' || m.last_name AS manager
    FROM employee e
    LEFT JOIN employee m ON e.manager_id = m.id`); // all distinct managers gotten from ran query
    return res.rows;
  } catch (err) {
    console.error("Query execution error", err.stack);
  }
};

// add a new department function
const addDepartment = async (name) => {
  try {
    await pool.query("INSERT INTO department (name) VALUES ($1)", [name]); // new department inserted
    console.log(`Added department: ${name}`); // confirmation logged
  } catch (err) {
    console.error("Query execution error", err.stack); // errors logged
  }
};

// add a new role function
const addRole = async (title, salary, departmentName) => {
  try {
    const depRes = await pool.query(
      "SELECT id FROM department WHERE name = $1",
      [departmentName]
    ); // department ID by name gotten
    const departmentId = depRes.rows[0].id; // department ID extracted
    await pool.query(
      "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
      [title, salary, departmentId]
    ); // new role inserted
    console.log(`Added role: ${title}`); // confirmation logged
  } catch (err) {
    console.error("Query execution error", err.stack); // errors logged
  }
};

// add a new employee function
const addEmployee = async (first_name, last_name, roleTitle, managerName) => {
  try {
    const roleRes = await pool.query("SELECT id FROM role WHERE title = $1", [
      roleTitle,
    ]); // role ID by title gotten
    const roleId = roleRes.rows[0].id; // role ID extracted

    let managerId = null;
    if (managerName) {
      const managerNames = managerName.split(" "); // Split the manager's name into separate variables for the first name and last name.
      const managerRes = await pool.query(
        "SELECT id FROM employee WHERE first_name = $1 AND last_name = $2",
        [managerNames[0], managerNames[1]]
      ); // manager ID by name gotten
      managerId = managerRes.rows[0]?.id || null; // manager ID extracted or set to null
    }

    await pool.query(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
      [first_name, last_name, roleId, managerId]
    ); // new employee inserted
    console.log(`Added employee: ${first_name} ${last_name}`); // confirmation logged
  } catch (err) {
    console.error("Query execution error", err.stack); // errors logged
  }
};

// update an employee's role function
const updateEmployeeRole = async (employeeName, roleTitle, managerName) => {
  try {
    const employeeNames = employeeName.split(" "); // Split the employees' name into separate variables for the first name and last name.
    const roleRes = await pool.query("SELECT id FROM role WHERE title = $1", [
      roleTitle,
    ]); // role ID by title gotten
    const roleId = roleRes.rows[0].id; // role ID extracted

    const managerNames = managerName.split(" "); // Split the manager's name into separate variables for the first name and last name.
    const managerRes = await pool.query(
      "SELECT id FROM employee WHERE first_name = $1 AND last_name = $2",
      [managerNames[0], managerNames[1]]
    ); // manager ID by name gotten
    const managerId = managerRes.rows[0].id; // manager ID extracted

    await pool.query(
      "UPDATE employee SET role_id = $1, manager_id = $2 WHERE first_name = $3 AND last_name = $4",
      [roleId, managerId, employeeNames[0], employeeNames[1]]
    ); // employee role and manager updated
    console.log(
      `Updated employee: ${employeeName} with new role: ${roleTitle} and manager: ${managerName}`
    ); // confirmation logged
  } catch (err) {
    console.error("Query execution error", err.stack); // errors logged
  }
};

// all functions exported
module.exports = {
  viewDepartments,
  viewRoles,
  viewEmployees,
  viewManagers,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};
