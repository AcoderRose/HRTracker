require("dotenv").config();
var inquirer = require("inquirer");
const { Pool } = require("pg");
const Query = require("./query");

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  database: process.env.DATABASE,
});

pool.connect();

const query = new Query();

const runInq = async () => {
  let answer;
  try {
    answer = await inquirer.prompt([
      {
        type: "list",
        name: "menu",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ]);
  } catch (error) {
    if (error.isTtyError) {
      console.error("Not rendering...");
    } else {
      console.error(error);
    }
  }
  const question = [];
  switch (answer.menu) {
    case "view all departments":
      const viewDepartments = async () => {
        const output = await query.seeDepartments();
        console.table(output.rows);
      };
      await viewDepartments();
      break;

    case "view all roles":
      const viewRoles = async () => {
        const output = await query.seeRoles();
        console.table(output.rows);
      };
      await viewRoles();
      break;

    case "view all employees":
      const viewEmployees = async () => {
        const output = await query.seeEmployees();
        console.table(output.rows);
      };
      await viewEmployees();
      break;

    default:
      console.log("Quitting...");
  }
  answer = await inquirer.prompt(question);
  console.log(answer);
};

runInq();
