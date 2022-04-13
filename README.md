# E-Commerce Backend 
> Backend API for an e-commerce site built with Node.js/Express and Postgres.
> Live API docs [_here_](https://crk-e-commerce.herokuapp.com/api-docs/). 

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Setup](#setup)
* [Testing](#testing)
* [Usage](#usage)
* [Project Status](#project-status)
* [Room for Improvement](#room-for-improvement)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)


## General Information
- Backend API for an e-commerce site built with Node.js and Express
- Endpoints for shopping, authentication, user accounts, and checkout
- Provides setup for Postgres database
- Built as a learning project, feedback appreciated!



## Features
#### Shopping 
- Shopping routes that allow shoppers to browse by category or search for products
- Persistent carts that consolidate when user logs-in/registers so shopping data is not lost
#### User Accounts
- Users can create an account to save shopping session and view information about their orders
- Allow users to store addresses and payment methods, and set a primary address and primary payment method
#### Fully-Built Checkout Flow
- User can use saved payment methods and addresses, or enter new ones at checkout
- Checkout route provides a review page before placing order
- Payment processing with Stripe API
#### Security
- Custom hashing function for passwords using bcrypt and a salt 
- Custom RSA authentication middleware using secure JWT Bearer Tokens to protect against CSRF
- Custom data sanitizer and validation for protection against XSS attacks
- Parameterized queries to protect against SQL injection 
#### Testing 
- Thorough test suite with multiple tests for each route
- End-to-end tests for the checkout flow 
- `pre-test` and `post-test` scripts to automate testing setup and tear down 
#### API Documentation
- Documentation with Swagger 


## Technologies Used
#### Server
- `node.js` - version 14.17.1
- `npm` - version 8.3.0
- `express` - version 4.17.1
- `express-session` - version 1.17.2
- `http-errors` - version 1.8.1
- `jsonwebtoken` - version 8.5.1
- `stripe` - version 8.195.0
- `validator` - version 13.7.0
- `nodemon` - version 2.0.15
- `body-parser` - version 1.19.0
- `cookie-parser` - version 1.4.6
- `cors` - version 2.8.5
- `helmet` - version 4.6.0

#### Database
- `psql` (PostgreSQL) - version 14.0
- `connect-pg-simple` - version 7.0.0
- `pg` (node-postgres) - version 8.7.1

#### Documentation
- `swagger-jsdoc` - version 1.3.0
- `swagger-ui-express` - version 4.3.0

#### Testing
- `jest` - version 27.4.3
- `supertest` - version 6.1.6
- `supertest-session` - version 4.1.0


## Setup
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

## Testing

To run tests, make sure database is set up (run `db/init.sql`) and `.env` contains is completed as described above. 

Once test data is added, run: 
```
npm test
```
*Note*: `npm test` script will also  run `npm pretest` and `npm posttest` which include scripts for setting up and tearing down test data in database.

## Usage
This project can be used as a backend for an e-commerce website. 
The project handles various endpoints a user may need to access while online shopping such as: 
- creating user accounts
- users can save addresses and payment methods to account
- displaying products and allowing query by parameter
- creating carts, and consolidating carts when a user logs in
- checkout flow and charging payments with Stripe
- order summaries accessed through user account

__Note:__ Must use HTTPS with JWT Bearer Authentication 
See [Swagger API Documentation](https://crk-e-commerce.herokuapp.com/api-docs/) for info routes and their variable requirements. 


## Project Status
___IN PROGRESS:__ Working on additional secutiry measures_

## Room for Improvement

Room for improvement:
- Encryption of data in database
- Add more indexes to the database for faster queries

To do:
- Allow guest checkout flow
- Send confirmation email after POSTing order
- Build demo frontend site


## Acknowledgements
This project was built as part of Codecademy's Full-Stack Engineer curriculum. 
Project prompt of creating an e-commerce backend was provided by Codecademy as well as 
some helpful resources for using Express and Postgres. No starter code was provided. 

Thanks to [@zachgoll](https://github.com/zachgoll) for his **very thorough** User Authentication tutorial for working with Passport.js and building custom authentication software.
Full tutorial can be found [here](https://www.youtube.com/watch?v=F-sFp_AvHc8&list=WL&index=4&t=20087s).


## Contact
Created by [@carokrny](https://carolynkearney.me) - feel free to contact me!
