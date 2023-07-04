const { actionQuery } = require("./questions/questions");

const {
  showDepartments,
  addDepartments,
  showRoles,
  addRoles,
  showEmployees,
  addEmployees,
  updateEmployees,
} = require("./dbFunctions/dbFunctions");

async function main() {
  const { action } = await actionQuery();

  if (action === "View all departments") {
    await showDepartments();
  } else if (action === "View all roles") {
    await showRoles();
  } else if (action === "View all employees") {
    await showEmployees();
  } else if (action === "Add a department") {
    await addDepartments();
  } else if (action === "Add a role") {
    await addRoles();
  } else if (action === "Add an employee") {
    await addEmployees();
  } else if (action === "Update the role of an employee") {
    await updateEmployees();
  } else {
    process.exit();
  }

  return main();
}

main();
