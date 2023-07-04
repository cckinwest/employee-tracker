const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "staff_db",
  },
  console.log("Connect to the staff_db database.")
);

const {
  addDepartment,
  addRole,
  addEmployee,
  updateRole,
} = require("../questions/questions");

const {
  findRoleid,
  findStaffid,
  getDeptsList,
  getRolesList,
  getStaffList,
  findManager,
} = require("../helper/helper");

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

module.exports = {
  showDepartments,
  addDepartments,
  showRoles,
  addRoles,
  showEmployees,
  addEmployees,
  updateEmployees,
};
