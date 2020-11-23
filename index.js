// import the pg library
import pg from 'pg';

import express from 'express';

// get Pool function from the library
const { Pool } = pg;

// set the way we will connect (configuration) to the server
// if we do not create this object (pgConnectionConfigs),
// then postgresql will just use the db with the same name as
// that of the user who is running the node command
const pgConnectionConfigs = {
  user: 'aljt',
  host: 'localhost',
  database: 'aljt',

  port: 5432, // Postgres server always runs on this port
};

// create a new instance of Pool,
// the fn that manages the database connections
// that Express.js is making and appropriately end those connections
const pool = new Pool(pgConnectionConfigs);

// create an instance of express
const app = express();

// set the port number for express
const PORT = 80;

// set the route for get request
app.get('/', (request, response) => {
  console.log('request came in');

  // callback fn when query is done
  const whenDoneWithQuery = (error, result) => {
    if (error) {
      console.log('Error executing query', error.stack);
      response.status(503).send(result.rows);
      return;
    }

    console.log(result.rows[0].description);

    // send the response which is an array of objects
    // each object contains the column header and values
    // of a row in the table.
    response.send(result.rows);
  };

  // run the query to get all rows from the meals table
  pool.query('SELECT * from meals', whenDoneWithQuery);
});

app.listen(PORT);
