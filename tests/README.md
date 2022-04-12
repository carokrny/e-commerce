# E-Commerce API Test Suite


## Setup 
###### You must set up the server before running tests.
To run locally, first install node_modules and generate RSA Key Pair:

```
npm install
```
Will also run `install ` script of `package.json`, which will generate an RSA key pair in a `.env` file.

Open a PostgreSQL database of your choice. Schema with tables is located in `db/init.sql`. E.g., generate tables by running:
```
cd db
cat init.sql | psql -h [PGHOST] -U [PGUSER] -d [PGDATABASE] -w [PGPASSWORD]
```
Where 'PGHOST', 'PGUSER', 'PGDATABASE', and 'PGPASSWORD' are your respective Postgres host, user, database, and password values.

Add the following fields with respective values to the `.env` file: 

``` 
# Postgres Database
PGHOST=
PGUSER=
PGDATABASE=
PGPASSWORD=
PGPORT=

# Express server
PORT=
SESSION_SECRET=

# Node.js 
NODE_ENV=

# Stripe key pair 
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
```
Create an account with Stripe to generate a key pair. 
Can use a test key pair for development that will not charge cards.

Then run the app: 

```
node index.js
```


## Running Tests 
To run tests, make sure database is set up (run `db/init.sql`) and `.env` contains is completed as described above. 

Once test data is added, run: 
```
npm test
```
*Note*: `npm test` script will also  run `npm run pretest` and `npm run posttest` which include scripts for setting up and tearing down test data in database.

### Pre Test
The `pretest` npm script will add specific test data to your database before tests are run. It will not effect any other data in your database.

### Post Test
The `posttest` npm script will remove the test data from your database after tests are run. It will not remove other data from your database.

If your tests fail and the `posttest` script fails to run, you can call it manually `npm run posttest` or calling the file directly with `node tests/testData/removeTestData.js`.

If you want to remove all data from your database and don't want to have to do it manually, I wrote a file for that. Run `node tests/testData/removeAllData.js`.


## FAQ

###### Tests failing on initial run after setting up DB
If your tests fail on the first run, don't dispair. This happens frequently when used on a fresh DB, I don't know why. If you have any idea as to why, please email me @ carolynkrny@gmail.com. Clear the test data from the db (`npm run posttest`) and run the test suite again until it passes. 

###### Why are some E2E tests randomly failing?
Sometimes one or more of the E2E checkout tests will fail on a particular run even though every other test passes. I don't know why, something must overflow and these are the longest tests. Clear the test data from the db (`npm run posttest`) and then run the test suite again and they will likely pass.

