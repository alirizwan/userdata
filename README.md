# userdata

USER Data Test

## Environment setup

1. Clone the repo and install dependencies...

   ```bash
   $ cd /path/to/repo
   $ npm install
   ```

2. Create a `.env` file using the template from .env.sample.

3. Run the API...

   ```bash
   $ npm start
   ```

## Database selection
In your `.env` file for variable `DB_TYPE` use `dynamo` for AWS DynamoDB or `mysql` for MySQL.
1. In case of dynamodb working sample credentials are in the email or you can create a table in Dynamo with name `MyJar-Users` with `id` [STRING] as Primary Key
2. In case of mysql create a table using following create table syntax:
CREATE TABLE `Users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(250) DEFAULT NULL,
  `address1` varchar(150) DEFAULT NULL,
  `city1` varchar(50) DEFAULT NULL,
  `street1` varchar(50) DEFAULT NULL,
  `zipcode1` varchar(50) DEFAULT NULL,
  `address2` varchar(50) DEFAULT NULL,
  `city2` varchar(50) DEFAULT NULL,
  `street2` varchar(50) DEFAULT NULL,
  `zipcode2` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

## Running and Testing

1. Create User
`http://localhost:3000/users/` [POST] `{ "name": "Test Name", "email": "ali@test.com", "phone": "+442079460964" }`
2. Get Users
`http://localhost:3000/users/` [GET]
3. Get User By Id
`http://localhost:3000/users/?id=USER_ID` [GET]
4. Search (put query fields in query string to search with more than one fields)
`http://localhost:3000/users/?name=SOME_NAME&phone=SOME_PHONE` [GET]
