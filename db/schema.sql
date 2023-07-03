drop database if exists staff_db;
create database staff_db;

use staff_db;

create table departments (
    id int not null auto_increment primary key,
    name varchar(30) not null
);

create table roles (
    id int not null auto_increment primary key,
    title varchar(30) not null,
    salary decimal not null,
    department_id int,
    foreign key (department_id) references departments(id) on delete set null
);

create table employees (
    id int not null auto_increment primary key,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int,
    manager_id int,
    foreign key (role_id) references roles(id) on delete set null
);