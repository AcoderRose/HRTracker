require("dotenv").config(); // environment variables loaded

const inquirer = require("inquirer"); // inquirer prompts imported

// import functions for querying the database.
const {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
} = require("./query");

// function for mainMenu
const mainMenu = async () => {
  const answer = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "What do you want to do next?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
      "Exit",
    ],
  });
  switch (answer.action) {
    case "View all departments":
      const departments = await viewDepartments();
      console.table(departments);
      break;
    case "View all roles":
      const roles = await viewRoles();
      console.table(roles);
      break;
    case "View all employees":
      const employees = await viewEmployees();
      console.table(employees);
      break;
    case "Add a department":
      await promptAddDepartment();
      break;
    case "Add a role":
      await promptAddRole();
      break;
    case "Add an employee":
      await promptAddEmployee();
      break;
    case "Update an employee role":
      await promptUpdateEmployeeRole();
      break;
    case "Exit":
      process.exit();
  }
  mainMenu(); // Return to the main menu after completing an action.
};

// new department name prompted
const promptAddDepartment = async () => {
  const answer = await inquirer.prompt({
    type: "input",
    name: "name",
    message: "Department name?",
  });
  await addDepartment(answer.name);
};

// add a new role prompted
const promptAddRole = async () => {
  const departments = await viewDepartments();
  const departmentNames = departments.map((dep) => dep.name);
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "New role title?",
    },
    {
      type: "input",
      name: "salary",
      message: "New role salary?",
    },
    {
      type: "list",
      name: "department",
      message: "Which department for new role?",
      choices: departmentNames,
    },
  ]);
  await addRole(answers.title, answers.salary, answers.department);
};

// add a new employee prompted
const promptAddEmployee = async () => {
  const roles = await viewRoles();
  const roleTitles = roles.map((role) => role.title);
  const managers = await viewEmployees();
  const managerNames = managers.map(
    (mgr) => `${mgr.first_name} ${mgr.last_name}`
  );
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "First name?",
    },
    {
      type: "input",
      name: "last_name",
      message: "Last name?",
    },
    {
      type: "list",
      name: "role",
      message: "New employee's role?",
      choices: roleTitles,
    },
    {
      type: "list",
      name: "manager",
      message: "Managed by who?",
      choices: managerNames,
    },
  ]);
  await addEmployee(
    answers.first_name,
    answers.last_name,
    answers.role,
    answers.manager
  );
};

// update an employee's role prompted
const promptUpdateEmployeeRole = async () => {
  const employees = await viewEmployees();
  const employeeNames = employees.map(
    (emp) => `${emp.first_name} ${emp.last_name}`
  );
  const roles = await viewRoles();
  const roleTitles = roles.map((role) => role.title);
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Which employee to update?",
      choices: employeeNames,
    },
    {
      type: "list",
      name: "role",
      message: "Employee's new role?:",
      choices: roleTitles,
    },
    {
      type: "list",
      name: "manager",
      message: "Managed by who?",
      choices: employeeNames,
    },
  ]);
  await updateEmployeeRole(answers.employee, answers.role, answers.manager);
};
// Application started
mainMenu();
