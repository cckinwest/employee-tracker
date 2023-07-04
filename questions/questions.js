const inquirer = require("inquirer");

const actionQuery = async () => {
  const response = await inquirer.prompt([
    {
      type: "rawlist",
      message: "What would you like to do?",
      name: "action",
      choices: [
        "View all departments",
        "Add a department",
        "View all roles",
        "Add a role",
        "View all employees",
        "Add an employee",
        "Update the role of an employee",
        "Quit",
      ],
    },
  ]);

  return response;
};

const addDepartment = async () => {
  const response = await inquirer.prompt([
    {
      type: "input",
      message: "What is the name of the new department?",
      name: "name",
    },
  ]);

  return response;
};

const addRole = async (ListOfDepartments) => {
  const response = await inquirer.prompt([
    {
      type: "input",
      message: "What is the name of the new role?",
      name: "title",
    },
    {
      type: "number",
      message: "What is the salary of the new role?",
      name: "salary",
    },
    {
      type: "list",
      message: "What is the the department of the new role?",
      name: "department_name",
      choices: ListOfDepartments,
    },
  ]);

  return response;
};

const addEmployee = async (ListOfRoles, ListOfManagers) => {
  const response = await inquirer.prompt([
    {
      type: "input",
      message: "What is the first name of the new employee?",
      name: "first_name",
    },
    {
      type: "input",
      message: "What is the last name of the new employee?",
      name: "last_name",
    },
    {
      type: "list",
      message: "What is the role of the new employee?",
      name: "title",
      choices: ListOfRoles,
    },
    {
      type: "list",
      message:
        "Who is the manager of the new employee (first name, last name)?",
      name: "manager",
      choices: ListOfManagers,
    },
  ]);

  return response;
};

const updateRole = async (ListOfStaff, ListOfRoles) => {
  const response = await inquirer.prompt([
    {
      type: "list",
      message: "Whose role do you need to update?",
      name: "fullName",
      choices: ListOfStaff,
    },
    {
      type: "list",
      message: "What is the new role?",
      name: "newTitle",
      choices: ListOfRoles,
    },
  ]);

  return response;
};

module.exports = {
  actionQuery,
  addDepartment,
  addRole,
  addEmployee,
  updateRole,
};
