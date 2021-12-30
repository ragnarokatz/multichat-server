/* create table */
DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts (
    id serial PRIMARY KEY,
    username varchar(12) NOT NULL,
    description varchar(30) NOT NULL,
    age int NOT NULL
);


/* insert data */
INSERT INTO accounts (username, description, age)
    VALUES ('ragnarokat', 'a senior old man', 76);

INSERT INTO accounts (username, description, age)
    VALUES ('ragnarok', 'a youthful kid', 5);

INSERT INTO accounts (username, description, age)
    VALUES ('bowragon', 'a working fellow', 24);

