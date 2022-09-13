//call variables to use npm packages
const express = require('express');
const sql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
//call table variables
let employee;
let departments;
let roles;
let managers;

//localhost
const PORT = process.env.PORT || 3001;
const app = express();

//middlewear
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connect to database
const db = sql.createConnection({
    host: 'localhost',
    user:'root',
    password: 'rootroot',
    database: 'employees'
}, console.log('Connected to Employee Database!')
);

db.connect(function(err){
    if(err) throw err;
    startApp();
    getEmployee();
    getDept();
    getRoles();
    getManagers(); 
});

startApp = () => {
    inquirer
    .prompt({
        name: "choices",
        type: "list",
        message: "Choose one of the following options:",
        choices: ["ADD EMPLOYEE", "ADD DEPARTMENT","ADD ROLE", "VIEW ALL EMPLOYEES", "VIEW ALL ROLES", "VIEW ALL DEPARTMENTS","UPDATE EMPLOYEE ROLE", "DELETE OPTIONS", "QUIT"]
    })
    .then(function(answer){
        if(answer.choices === "ADD EMPLOYEE"){
            addEmployee();
        }
        else if (answer.choices === "ADD DEPARTMENT"){
            addDepartment();
        }
        else if(answer.choices === "ADD ROLE"){
            addRole();
        }
        else if(answer.choices === "VIEW ALL EMPLOYEES"){
            viewEmpl();
        }
    })
};

addEmployee = () => {
    getRoles();
    getManagers();
    let roleOptions = [];
    for (let i = 0; i < managers.length; i++) {
        managerOptions.push(Object(roles[i]));
    }
    inquirer.prompt([
    {
        name:  "first_name",
        type: "input",
        message: "Enter the employees FIRST NAME:"
    },
    {
        name: "last_name",
        type: "input",
        message: "Enter the employees LAST NAME:"
    },
    {
        name: "role_id",
        type: "list",
        message: "Enter employees manager:",
        choices: function() {
            let choiceArr = [];
            for (let i = 0; i < managerOptions.length; i++) {choiceArr.push(managerOptions[i].managers)   
            }
            return choiceArr
        }
    }
]).then(function(answer){
    for (let i = 0; i < roleOptions.length; i++) {
    if(roleOptions[i].title === answer.role_id){
        role_id = roleOptions[i].id
        } 
    }
    for (let i = 0; i < managerOptions.length; i++) {
      if( manager_id = managerOptions[i].id){ 
            }
        }
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.first_name}', '${answer.last_name}', ${role_id}, ${manager_id})`, (err,res)=> {
            if (err) throw err;
            console.log(`New employee addeed: ${answer.first_name} ${answer.last_name}
            `);
            getEmployee();
            startApp();
        })
    })
};

addDepartment = () => {
    inquirer.prompt([
        {
            name: "dept_name",
            type: "input",
            message: "Enter the department name:"
        }
    ]).then(function(answer){
        db.query(`INSERT INTO department (dept_name) VALUES ('${answer.dept_name}')`, (err, res)=> {
            if(err) throw err;
            console.log(`New Department: ${answer.dept_name}`);
            getDeptartments();
            startApp();
        })
    })
};
addRole = () => {
    let departmentOptions = [];
    for (let i = 0; i < departments.length; i++) {
       departmentOptions.push(Object(departments[i])); 
    };
    inquirer
    .prompt([
        {
            name:"title",
            type:"input",
            message: "Enter Role:"
        },
        {
            name: "salary",
            type: "input",
            message: "Enter the associated salary:"
        },
        {
            name: "department_id",
            type: "list",
            message: "Select the appropriate department:",
            choices: departmentOptions
        },
    ]).then(function(answer){
        for (let i = 0; i < departmentOptions.length; i++) {
        if (departmentOptions[i].dept_name === answer.department_id){
            department_id = departmentOptions[i].id
             }
        }    
    db.query(`INSERT INTO role(title, salary, department_id) VALIES ('${answer.title}', '${answer.salary}', '${department_id}')`, (err, res) => {
        if (err) throw err;
        console.log(`New role added: ${answer.title}`);
        getRoles();
        startApp();
        })
    })
};

viewEmpl = () => {
    db.query(`SELECT employee.id, employee.first_name, employee_lastname, department.dept_name AS department, role.title, role.salary, CONCAT_WS(" ", manager.first_name, manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON manager.id = employee.manager_id INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY employee.id ASC`, (err, res) => {
        if (err) throw err;
        console.log(err || result);
        showTable(res);
        startApp();
    });
};