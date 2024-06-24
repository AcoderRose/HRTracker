INSERT INTO department (name) VALUES ('Customer Experience'), ('Confectionery'), ('Delicatessen'), ('Fresh Food'), ('Leadership');

INSERT INTO role (title, salary, department_id) VALUES ('Clerk', 50000, 1), ('Confectioner', 55000, 2), ('Carver', 60000, 3), ('Shelver', 45000, 4), ('Supervisor', 120000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Jan', 'Levinson', 5, 7),
('Pam', 'Beesly', 2, 6),
('Erin', 'Hannon', 3, 6),
('Ryan', 'Howard', 4, 1),
('Jim', 'Halpert', 5, 7),
('Dwight', 'Schrute', 5, 7),
('Michael', 'Scott', 5, null), --Highest-level Supervisor other supervisors report to Wayne
('Stanley', 'Hudson', 1, 5),
('Creed', 'Bratton', 4, 1);