//call variables for npm packages
const sql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

//middlewear
const PORT = process.env.PORT || 3001;

//login and connection connection
let db = sql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootroot",
  database: "employees"
});

db.connect(function (err){
  if (err) throw err;
  console.log(err)
  runApp();
});

//initial questions which allows you to go through the application or exit out
function runApp() {

  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "Would you like to do?",
      choices: [
        "View Employees",
        "View Employees by Dept",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Add Role",
        "Exit"]
    })
    .then(function ({ task }) {
      switch (task) {
        case "View Employees":
          viewEmployee();
          break;
        case "View Department":
          viewDept();
          break;
        case "View Roles":
          viewRoles();
          break;
        case "View Employees by Dept":
          viewEmployeeByDept();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employee":
          removeEmployees();
          break;
        case "Update Employee Role":
          updateEmpRole();
          break;
        case "Add Role":
          addRole();
          break;
        case "Exit":
          db.end();
          break;
      }
    });
}


function viewEmployee() {
  console.log("EMPLOYEE DATA:\n");

  let queryInput =
  `SELECT employee.id, employee.first_name, employee.last_name,role.title,department.name AS department,role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  db.query(queryInput, function (err, res) {
    if (err) throw err;

    console.table(res);
    runApp();
  });
};
function viewDept()  {
  console.log("DEPARTMENTS:\n");
  db.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    });
    console.table(res);
    runApp();
  };

function viewRoles() {
  console.log("ROLES:\n");
  let queryInput = `SELECT role.id, role.title, department.name AS department, salary FROM role INNER JOIN department ON role.department_id = department.id`;
  db.query(queryInput, (err, res) => {
    if(err) throw err;
  });
  console.table(res);
  runApp();
};

function viewEmployeeByDept() {
  console.log("EMPLOYEE BY DEPARTMENT:\n");

  let queryInput =
  `SELECT department.name AS Department, CONCAT(employee.first_name, " ", employee.last_name) AS Employee FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY department,employee.last_name`;

  db.query(queryInput, function (err, res) {
    if (err) throw err;

    const deptChoices = res.map(data => ({
      value: data.id, name: data.name
    }));

    console.table(res);
    runApp();
  });
};

function addEmployee() {

  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "Insert employee's FIRST NAME:"
      },
      {
        name: "last_name",
        type: "input",
        message: "Insert employee's LAST NAME:?"
      },
    ])
    .then(function (answer) {
     const employeeDemographics = [answer.first_name, answer.last_name];
      let queryInput = `SELECT role.id, role.title FROM role`;
      db.query(queryInput,(err, ans) =>{
        if (err) throw err;
        const roles = ans.map(({ id, title }) => ({ name:title, value:id }));

        inquirer
        .prompt([
          {
            name: "role",
            type:"list",
            message: "Choose a role from the following:",
            choices: roles,
          },
        ]).then((roleChoices) => {
          const role = roleChoices.role;
          employeeDemographics.push(role);

          const mngrQuery = `SELECT * FROM employee`;
          db.query(mngrQuery, (err, ans) => {
            if (err) throw err;
            const mngrs = ans.map(({ id, first_name, last_name }) =>({
              name: first_name + " " + last_name,
              value: id,
            }));

            inquirer.prompt([
              {
                name:"manager",
                type: "list",
                message: "Choose the employees manager from the following:",
                choices: mngrs,
              },
            ]).then((mngrChoices) => {
              const mngr = mngrChoices.mngr;
              employeeDemographics.push(mngr);
              
              let queryInput = `INSERT INTO employee (first_name, last_name, role_id,manager_id) VALUES (?, ?, ?, ?)`;
              db.query(queryInput, employeeDemographics, (err, ans) => {
                if (err) throw err;
                viewEmployee();
              });
            })
          });
        });
      });
    });
};

function removeEmployees() {
  let queryInput = `SELECT * FROM employee`;

  db.query(queryInput, (err, res) => {
    if (err) throw err;

    const delEmplChoices = res.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
    .prompt([
      {
        name: "employeeId",
        type: "list",
        message: "Which of the following employees would you like to DELETE from your database?",
        choices: delEmplChoices
      }
    ])
    .then((emplChoice) => {
      let employeeDemographics =[];
      const empl = emplChoice.employeeId;
      employeeDemographics.push(empl);

      let queryInput = `DELETE FROM employee WHERE ?`;
      db.query(queryInput, employeeDemographics,(err, res) => {
        viewEmployee();
        runApp();
      });
    });  
  });
};



function updateEmpRole() {
  let emplQuery = `SELECT * FROM employee`
  db.query(emplQuery, (err, res) => {
    if (err) throw err;
    let empls = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id,   
    }));
    console.log(empls);

    inquirer
    .prompt([
      {
        name: "employeeId",
        type: "list",
        message: "Choose the employee you want update the role for:",
        choices: empls,
      },

    ]).then((employeeChoice) =>{
      let empl = employeeChoice.employeeId;
      let employeeDemographics = [];
      employeeDemographics.push(empl);

      let roleQuery = `SELECT * FROM role`;
      db.query(roleQuery, (err, res) =>{
        if (err) throw err;
        let rolez = res.map(({ id, title }) => ({name: title, value: id, 
        }));
        inquirer
        .prompt([
          {
            name: "newRole",
            type: "list",
            message: "Choose from the following roles:",
            choices: rolez,
          },
        ]).then((roleChoice) =>{
          let updatedRole = roleChoice.newRole;
          employeeDemographics.push(updatedRole);
          let rev = employeeDemographics.reverse();
          let finalUpdateQuery = `UPDATE employee SET role_id = ? WHERE id = ?`
          db.query(finalUpdateQuery, rev, (err,res) =>{
            if (err) throw err;
            viewEmployee();
            runApp();
          });
        });
      });
    });
  });
};
  
function addRole() {

  inquirer
    .prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "Enter the role's title:"
      },
      {
        name: "roleSalary",
        type: "input",
        message: "Enter the role's salary:"
      }
    ]).then((answer)=> {
      let roleDemos = [answer.roleTitle, answer.roleSalary];
      let queryInput = `SELECT name, id FROM department`;
      db.query(queryInput, (err,res) => {
        if (err) throw err;
        let deptmnt = res.map(({ name, id }) => ({
          name: name, value: id,
        }));
        inquirer
          .prompt([
            {
              name: "dept_id",
              type: "list",
              message: "Choose from the following departments:",
              choices: deptmnt,
          }
        ]).then((deptChoice) =>{
          let deptment = deptChoice.dept_id;
          roleDemos.push(deptment);
          let queryInput = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
          db.query(queryInput, roleDemos, (err, res)=> {
            if (err) throw err;
            viewEmployee();
          });
        });
      });
    });
  };   
