CREATE DATABASE IF NOT EXISTS tokens ;

USE tokens;

CREATE TABLE IF NOT EXISTS tokens(
id INT AUTO_INCREMENT,
PRIMARY KEY(id),
token TEXT(500) NOT NULL ,
expired BOOLEAN DEFAULT FALSE NOT NULL,
user_Email VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS refresh_tokens(
id INT AUTO_INCREMENT ,
PRIMARY KEY(id),
refresh_token TEXT(500) NOT NULL ,
user_Email VARCHAR(50) NOT NULL
)




