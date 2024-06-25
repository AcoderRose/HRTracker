const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  database: process.env.DATABASE,
});

function Query() {}

Query.prototype.seeDepartments = () => {
  // department table data gotten
  const output = pool.query("SELECT * FROM department");
  return output;
};

Query.prototype.seeRoles = () => {
  // role and department tables data gotten
  const output = pool.query(
    "SELECT r.id, r.title, r.salary, d.name AS department FROM role r JOIN department d ON r.department_id = d.id"
  );
  return output;
};

Query.prototype.seeEmployees = () => {
  // employee data returned
  const output =
    pool.query(`SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department,
    employee.first_name||' '||employee.last_name AS manager 
    FROM employee e LEFT JOIN employee ON e.manager_id=employee.id 
    JOIN role r ON e.role_id = r.id 
    JOIN department d ON r.department_id = d.id`);
  return output;
};

Query.prototype.seeManagers = async () => {
  // using employee table manager data is returned
  const output = pool.query(
    `SELECT DISTINCT employee.first_name||' '||employee.last_name AS manager FROM employee e LEFT JOIN employee ON e.manager_id=employee.id`
  );
  return output;
};

module.exports = Query;
