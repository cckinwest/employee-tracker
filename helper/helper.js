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

module.exports = {
  findRoleid,
  findStaffid,
  getDeptsList,
  getRolesList,
  getStaffList,
  findManager,
};
