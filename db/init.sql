-- db/init.sql
CREATE DATABASE IF NOT EXISTS college_db;
USE college_db;

-- users table for login
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(50)
);

INSERT INTO users (username, password, role) VALUES
('admin', '12345', 'admin'),
('BARANI', '123456', 'admin');

-- students table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  course VARCHAR(150),
  year VARCHAR(50)
);

INSERT INTO students (name, course, year) VALUES
('Barani Krishnan G', 'B.Tech CSE', '3rd Year'),
('Vasu Devan R', 'B.Sc IT', '2nd Year'),
('Harrish V', 'BBA', '1st Year');

-- staff table
CREATE TABLE IF NOT EXISTS staffs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  department VARCHAR(100),
  role VARCHAR(100),
  email VARCHAR(150)
);

INSERT INTO staffs (name, department, role, email) VALUES
('Prof. Rajesh Kannan', 'CSE', 'Assistant Professor', 'rk@college.edu'),
('Dr. Nandhini', 'CSE', 'HOD', 'nandhini@college.edu'),
('Ms. Madhu Nisha', 'IT', 'STAFF', 'madhu@college.edu');
