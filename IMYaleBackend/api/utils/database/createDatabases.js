require('module-alias/register')
const pool = require("@utils/database/pool")

// create users table
const createUsersTable = () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `;

    return pool.query(queryText);
};

// execute all table creation queries sequentially
const start = async () => {
    console.log("Starting table creation...");
}

start()
    .then(createUsersTable)
    .then(createReviewsTable)
    .then(createCommentsTable)
    // .then(createImagesTable)
    .then(() => {
        console.log("All tables created successfully!");
        pool.end();
    })