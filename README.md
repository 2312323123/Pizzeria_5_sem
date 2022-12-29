# Pizzeria_5_sem

https://blog.logrocket.com/getting-started-with-postgres-in-your-react-app/

## postgres

- pobierz postgresa
- robimy przez konsolę
- trzeba dodać psql do zmiennych środowiskowych
- psql -d postgres -U postgres
- CREATE ROLE bazki_user WITH LOGIN PASSWORD 'bazki_user_haslo';
- ALTER ROLE bazki_user CREATEDB;
- \q
- psql -d postgres -U bazki_user
  ...
- CREATE DATABASE bazki_projekt_database;
  done

## node:

trzeba mieć node
w konsoli wpisać: `node --version`
mi wyskakuje `v18.12.1`
jak nie ma to https://nodejs.org/en/download

- sklonować repo
- wejść w node-postgres
- odpalić tam konsolę
- pewnie trzeba `npm install`
- jak skończy mielić to wpisać `node index.js`
- jak chcemy zresetować bazkę to zamiast tego `node reset.js`

nie ważne:
const Pool = require("pg").Pool; \
const pool = new Pool({ \
user: "bazki_user", \
host: "localhost", \
database: "bazki_projekt_database", \
password: "bazki_user_haslo", \
port: 5432, \
});

## react

- wejść w bazki_react
- odpalić tam konsolę
- npm install --global yarn
- yarn install
- yarn run dev
