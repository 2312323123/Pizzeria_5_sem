# Pizzeria_5_sem

## postgres

-

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

const Pool = require("pg").Pool;
const pool = new Pool({
user: "bazki_user",
host: "localhost",
database: "bazki_projekt_database",
password: "bazki_user_haslo",
port: 5432,
});

## react

- wejść w node-postgres
- odpalić tam konsolę
- yarn install
