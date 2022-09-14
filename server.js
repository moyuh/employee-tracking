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
        case "View Employees by Dept":
          viewEmployeeByDept();
          break;
        case "View Department":
          viewDept();
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
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON d.id = r.department_id LEFT JOIN employee m ON m.id = e.manager_id`

  db.query(queryInput, function (err, res) {
    if (err) throw err;

    console.table(res);
    runApp();
  });
};

function viewEmployeeByDept() {
  console.log("EMPLOYEE BY DEPARTMENT:\n");

  let queryInput =
    `SELECT d.id, d.name, r.salary AS budget FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON d.id = r.department_id`

  db.query(queryInput, function (err, res) {
    if (err) throw err;

    const deptChoices = res.map(data => ({
      value: data.id, name: data.name
    }));

    console.table(res);
    deptPrompts(deptChoices);
  });
}


function deptPrompts(deptChoices) {
  inquirer
    .prompt([
      {
        name: "dept_id",
        type: "list",
        message: "Choose following department:",
        choices: deptChoices
      }
    ])
    .then(function (answer) {
      console.log("answer ", answer.dept_Id);

      let queryInput =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON d.id = r.department_id WHERE d.id = gi `

      db.query(queryInput, answer.dept_Id, function (err, res) {
        if (err) throw err;

        console.table(res);
        runApp();
      });
    });
};
function viewDept()  {
  db.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    });

    console.log(res);
    runApp();
  }

function addEmployee() {

  let queryInput =
    `SELECT r.id, r.title, r.salary FROM role r`

  db.query(queryInput, function (err, res) {
    if (err) throw err;

    const roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));
    rolePrompts(roleChoices);
  });
}

function rolePrompts(roleChoices) {

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
      {
        name: "roleId",
        type: "list",
        message: "Add role for the employee from the following:",
        choices: roleChoices
      },
    ])
    .then(function (answer) {
      console.log(answer);

      let queryInput = `INSERT INTO employee SET ?`
      db.query(queryInput,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.roleId,
          manager_id: answer.managerId,
        },
        function (err, res) {
          if (err) throw err;
          console.table(res);
          runApp();
        });
    });
};

function removeEmployees() {
  let queryInput =
    `SELECT e.id, e.first_name, e.last_name FROM employee e`

  db.query(queryInput, function (err, res) {
    if (err) throw err;

    const delEmplChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${id} ${first_name} ${last_name}`
    }));

    console.table(res);
    deletionPrompt(delEmplChoices);
  });
}
//present employee list for to choose for deletion
function deletionPrompt(delEmplChoices) {

  inquirer
    .prompt([
      {
        name: "employeeId",
        type: "list",
        message: "Which of the following employees would you like to DELETE from your database?",
        choices: delEmplChoices
      }
    ])
    .then(function (answer) {

      let queryInput = `DELETE FROM employee WHERE ?`;
      // when finished prompting, insert a new item into the db with that info
      db.query(queryInput, { id: answer.employeeId }, function (err, res) {
        if (err) throw err;
        console.table(res);
        runApp();
      });
    });
};


function updateEmpRole() { 
  employeeArr();

}

function employeeArr() {
  let queryInput =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON d.id = r.department_id JOIN employee m ON m.id = e.manager_id`

  db.query(queryInput, function (err, res) {
    if (err) throw err;

    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${first_name} ${last_name}`      
    }));

    console.table(res);
    roleArr(employeeChoices);
  });
}

function roleArr(employeeChoices) {

  let queryInput =
    `SELECT r.id, r.title, r.salary FROM role r`
  let roleChoices;

  db.query(queryInput, function (err, res) {
    if (err) throw err;

    roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`      
    }));

    console.table(res);
    employeeRolePrompt(employeeChoices, roleChoices);
  });
}

function employeeRolePrompt(employeeChoices, roleChoices) {

  inquirer
    .prompt([
      {
        name: "employeeId",
        type: "list",
        message: "Choose the employee you want update the role for:",
        choices: employeeChoices
      },
      {
        name: "roleId",
        type: "list",
        message: "Choose the updated role:",
        choices: roleChoices
      },
    ])
    .then(function (answer) {

      let queryInput = `UPDATE employee SET role_id = ? WHERE id = ?`
      db.query(queryInput,
        [ answer.roleId,  
          answer.employeeId
        ],
        function (err, res) {
          if (err) throw err;

          console.table(res);
          runApp();
        });
    });
}


function addRole() {

  let queryInput =
  `SELECT d.id, d.name, r.salary AS budget FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON d.id = r.department_id GROUP BY d.id, d.name`

  db.query(queryInput, function (err, res) {
    if (err) throw err;
    const deptChoices = res.map(({ id, name }) => ({
      value: id, name: `${id} ${name}`
    }));

    console.table(res);
    console.log("Department array!");

    addRolePrompt(deptChoices);
  });
}

function addRolePrompt(deptChoices) {

  inquirer
    .prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "Enter role title:"
      },
      {
        name: "roleSalary",
        type: "input",
        message: "Enter role salary:"
      },
      {
        name: "dept_id",
        type: "list",
        message: "Choose from the following departments:",
        choices: deptChoices
      },
    ])
    .then(function (answer) {

      let queryInput = `INSERT INTO role SET ?`

      db.query(queryInput, {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.dept_Id
      },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          runApp();
        });

    });
}
