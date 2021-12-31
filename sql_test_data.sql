/* create table */
DROP TABLE IF EXISTS accounts;

DROP TABLE IF EXISTS rooms;

DROP TABLE IF EXISTS chats;

CREATE TABLE accounts (
    id serial PRIMARY KEY,
    username varchar(16) NOT NULL UNIQUE,
    passhash varchar(60) NOT NULL,
    verified boolean NOT NULL DEFAULT FALSE,
    room_id int DEFAULT NULL
);

CREATE TABLE rooms (
    id serial PRIMARY KEY,
    roomname varchar(16) NOT NULL UNIQUE,
    passhash varchar(60) NOT NULL,
    capacity int NOT NULL,
    active boolean NOT NULL DEFAULT TRUE
);

CREATE TABLE chats (
    id serial PRIMARY KEY,
    account_id int NOT NULL,
    room_id int NOT NULL,
    content varchar(200) NOT NULL,
    sendtime timestamp NOT NULL
);
