INSERT INTO department(name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role(title, salary, department_id)
VALUES ("Lawyer", "80000", "4"),
       ("Software Engineer", "85000", "2"),
       ("Sales-person", "50000", "1"),
       ("Accountant", "125000", "3"),
       ("Lead Engineer", "150000", "2"),
       ("Law Intern", "30000", "4");
       

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("John", "Senese", "1", "4"),
       ("Monica", "Yuh", "2", "1"),
       ("Sam", "Sampson", "6", "0"),
       ("Bob", "Humpfry", "3", "2"),
       ("Robert", "Belcher", "4", "5"),
       ("Lauren", "Andrews", "5", "4");     
