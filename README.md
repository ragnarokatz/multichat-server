## Postgres API Template

A template web api service with postgres SQL as database.

### Application links

- web-api: https://pg-api-template.herokuapp.com/

### Database

- postgres SQL

### Collections

- `accounts`

### Local database installation:

- download postgres SQL version 13.5 from official website
- install postgres SQL server, pgAdmin, and console commands/utilities
- after installation, run `bin/psql.exe -U postgres` from cmd
- authenticate with the password you created during installation
- create database with `CREATE DATABASE <database_name> WITH ENCODING 'UTF8' LC_COLLATE='English_United Kingdom' LC_CTYPE='United Kingdom';`
- after this point, you can use pgAdmin to connect to your database and run SQL queries including table creation, data population, etc.
- create a local .env file at root directory with the following environment variables

### Environment variables

- `PG_USER = postgres`
- `PG_HOST = localhost`
- `PG_DATABASE = <database>`
- `PG_PASSWORD = <password>`
- `PG_PORT = 5432`
- `USE_SSL = 0`
- `PORT = 8080`

### API

- `/` GET - homepage
- `/accounts` GET - get a list of accounts
- `/accounts/add` POST - add an account
- `/accounts/:account_id` PUT - update an account
- `/accounts/:account_id` DEL - delete an account
- `/accounts/:account_id` GET - get an account

### Dev environment setup

- `git clone` this repository
- `npm install`
- create a `.env` file in the root directory and fill in environment variables
- `npm run start`
- navigate to `localhost:8080` to view

### Tests

- `npm run jest` for unit testing
- `npm run jest:e2e` for integration testing
- `npm run coverage` for coverage
- `npm run prettier` to prettify code
