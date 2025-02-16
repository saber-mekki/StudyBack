CREATE DATABASE education;


CREATE TABLE userTable(
  id SERIAL PRIMARY KEY ,
  login VARCHAR(255),
  phone INTEGER,
  gender VARCHAR(255),
  password VARCHAR(255)
  registerType VARCHAR(255)
);

