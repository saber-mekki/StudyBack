CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 

CREATE DATABASE education;


CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL UNIQUE,
  user_password TEXT NOT NULL
  type_register TEXT CHECK (type_register IN ('student', 'tutor')) NOT NULL

);

SELECT * FROM users;

INSERT INTO users (user_name,user_email,user_password) VALUES ('test','test@test.com','test');

INSERT INTO users (user_name,user_email,user_password) VALUES ('sou','tests@test.com','test');

--psql -U postgres
--\c jwtdb
--\dt
--heroku pg:psql