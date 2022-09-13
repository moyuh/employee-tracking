//call variables to use npm packages
const express = require('express');
const sql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
//call table variables


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

