CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 

CREATE DATABASE education;


CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL UNIQUE,
  user_password TEXT NOT NULL,
  type_register TEXT CHECK (type_register IN ('student', 'tutor','admin')) NOT NULL
  phone_number TEXT,  
  gender TEXT CHECK (gender IN ('male', 'female')) 
);


SELECT * FROM users;

INSERT INTO users (user_name,user_email,user_password) VALUES ('test','test@test.com','test');


--to test
INSERT INTO users (user_name,user_email,user_password,type_register) VALUES ('admin','admin@admin.com','$2b$10$C4nknEgHTiJ3igaHDLSmaufW4VujYJl90xxjCY1.Vz.9S3vl7KHei','admin');

--$2b$10$C4nknEgHTiJ3igaHDLSmaufW4VujYJl90xxjCY1.Vz.9S3vl7KHei === '0000'

--
--Se connecter à PostgreSQL :sudo -u postgres psql
--psql -U postgres
--\c jwtdb
--\dt
--heroku pg:psql