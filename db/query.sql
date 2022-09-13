-- Viewing All
SELECT employee.id, employee_firstname, employee_lastname, department.dept_name AS department, role.title, role.salary, CONCAT_WS(" ",manager.first_name, manager.last_name) AS manager FROM employee LEFT JOIN manager ON manager.id = employee.manager_id INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY employee.id ASC;

-- Viewing roles
SELECT role.id, role.title, role.salary, department.dept_name as Department_Name FROM role INNER JOIN department ON role.department_id = department.id;

-- Viewing employees
SELECT id, CONCAT_WS(" ", first_name, last_name) AS Employee_Name FROM employee;

-- Updates:
UPDATE employee SET role_id = 3 WHERE id = 7;
UPDATE employee SET ? WHERE ?;

-- Deletes:
DELETE FROM department WHERE id = 13;
