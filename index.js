const mysql = require("mysql2");
require("dotenv").config();

const {
  actionQuery,
  addDepartment,
  addRole,
  addEmployee,
  updateRole,
} = require("./questions.js");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "staff_db",
  },
  console.log("Connect to the staff_db database.")
);

//helper function
async function findRoleid(title) {
  const [result, meta] = await db
    .promise()
    .query(`select id from roles where title = "${title}"`);

  return result["0"].id;
}

async function findStaffid(fullName) {
  const first_name = fullName.split(", ")[0];
  const last_name = fullName.split(", ")[1];

  const [result, meta] = await db
    .promise()
    .query(
      `select id from employees where first_name = "${first_name}" and last_name = "${last_name}"`
    );

  return result["0"].id;
}

async function getDeptsList() {
  const [result, meta] = await db
    .promise()
    .query(`select name from departments`);

  const deptsList = [];

  Object.keys(result).forEach((key) => {
    var row = result[key];
    deptsList.push(row.name);
  });

  return deptsList;
}

async function getRolesList() {
  const [result, meta] = await db.promise().query(`select title from roles`);

  const rolesList = [];

  Object.keys(result).forEach((key) => {
    var row = result[key];
    rolesList.push(row.title);
  });

  return rolesList;
}

async function getStaffList() {
  const [result, meta] = await db
    .promise()
    .query(
      `select concat(first_name, ", ", last_name) as fullName from employees`
    );

  const staffList = [];

  Object.keys(result).forEach((key) => {
    var row = result[key];
    staffList.push(row.fullName);
  });

  return staffList;
}

async function findManager(role_id) {
  const [result1, meta1] = await db
    .promise()
    .query(`select department_id from roles where id = "${role_id}"`);

  const department_id = result1["0"]["department_id"];

  const [result2, meta2] = await db.promise().query(
    `select employees.manager_id 
      from employees 
      inner join roles
      on employees.role_id = roles.id
      inner join departments
      on departments.id = roles.department_id
      where roles.department_id = ${department_id} and employees.manager_id is not null`
  );

  return result2["0"]["manager_id"];
}

//

async function showDepartments() {
  const [results, meta] = await db
    .promise()
    .query("select * from departments order by id asc");
  console.table(results);
}

async function addDepartments() {
  const { name } = await addDepartment();
  if (name) {
    await db
      .promise()
      .query(`insert into departments (name) values ("${name}")`);
  } else {
    console.log("There are errors!");
    return;
  }

  console.log("The new department is added successfully!");
}

async function showRoles() {
  const [results, meta] = await db.promise().query(
    ` select roles.id, roles.title, departments.name, concat("£", roles.salary) as monthly_salary
        from roles 
        inner join departments 
        on roles.department_id = departments.id order by roles.id asc`
  );

  console.table(results);
}

async function addRoles() {
  const deptsList = await getDeptsList();

  const { title, salary, department_name } = await addRole(deptsList);

  if (title && salary) {
    const [result, meta] = await db
      .promise()
      .query(`select id from departments where name = "${department_name}"`);

    const department_id = result["0"].id;

    await db
      .promise()
      .query(
        `insert into roles (title, salary, department_id) values ("${title}", ${salary}, ${department_id})`
      );
  } else {
    console.log("There are errors!");
    return;
  }

  console.log("The new role is added successfully!");
}

async function showEmployees() {
  const [results, meta] = await db.promise().query(
    ` select e.id, e.first_name, e.last_name, r.title, d.name, concat("£", r.salary) as monthly_salary, concat(m.first_name, ", ", m.last_name) as manager
      from employees e
      inner join roles r
      on e.role_id = r.id
      inner join departments d
      on r.department_id = d.id
      left join employees m
      on e.manager_id = m.id order by e.id asc
      `
  );

  console.table(results);
}

async function addEmployees() {
  const rolesList = await getRolesList();
  const staffList = await getStaffList();

  const { first_name, last_name, title, manager } = await addEmployee(
    rolesList,
    staffList
  );

  if (first_name && last_name) {
    const role_id = await findRoleid(title);

    const manager_id = await findStaffid(manager);

    await db.promise().query(
      ` insert into employees (first_name, last_name, role_id, manager_id) 
        values ("${first_name}", "${last_name}", ${role_id}, ${manager_id})`
    );
  } else {
    console.log("There are errors!");
    return;
  }

  console.log("The new employee is added successfully!");
}

async function updateEmployees() {
  const staffList = await getStaffList();

  const rolesList = await getRolesList();

  const { fullName, newTitle } = await updateRole(staffList, rolesList);

  const first_name = fullName.split(", ")[0];
  const last_name = fullName.split(", ")[1];

  const role_id = await findRoleid(newTitle);

  const manager_id = await findManager(role_id);

  await db
    .promise()
    .query(
      `update employees set role_id = ${role_id}, manager_id = ${manager_id} where first_name = "${first_name}" and last_name = "${last_name}"`
    );

  console.log("The information is updated successfully!");
}

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
