// import the pg library
import pg from 'pg';

// get client function from the library
const { Client } = pg;

// set the way we will connect (configuration) to the server
const pgConnectionConfigs = {
  user: 'aljt',
  host: 'localhost',
  database: 'aljt',

  port: 5432, // Postgres server always runs on this port
};

// create a new instance of the client
const client = new Client(pgConnectionConfigs);

// make the connection to the server
client.connect();

// to store the SQL query so we can pass it as a parameter to client.query
let sqlQuery;

// create the query done callback
const whenQueryDone = (error, result) => {
  // this error is anything that goes wrong with the query
  if (error) {
    console.log('error', error);
  } else {
    // rows key has the data
    // shows the data of all the rows of the database
    // only when sqlQuery = 'SELECT * from meals'
    console.log('result.rows:', result.rows);
  }

  // close the connection
  client.end();
};

// get the arguments in the command line
// create the sql query
// run the query using the client
if (process.argv[2] === 'report') {
  // write the SQL query that displays all the rows in meals table
  sqlQuery = 'SELECT * from meals';

  // run the SQL query
  client.query(sqlQuery, whenQueryDone);
} else if (process.argv[2] === 'log') {
  // create vars for the meal information
  const type = process.argv[3];
  const description = process.argv[4];
  const amtOfAlcohol = process.argv[5];
  const wasHungryBe4Eating = process.argv[6];

  const values = [type, description, amtOfAlcohol, wasHungryBe4Eating];

  // write the SQL query that inserts a new meal entry
  sqlQuery = 'INSERT INTO meals(type, description, amount_of_alcohol, was_hungry_before_eating) VALUES ($1, $2, $3, $4)';

  // run the SQL query
  client.query(sqlQuery, values, whenQueryDone);
}
