const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "qap3_db",
  password: "Patgames18!",
  port: 5432,
});

const getAllUsers = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users");
    return result.rows;
  } finally {
    client.release();
  }
};

const createUser = async (userData) => {
  console.log(userData); // Check what userData contains
  const { username, email, age } = userData;
  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO users ( username, email, age) VALUES ($1, $2, $3) RETURNING *",
      [username, email, age]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

const updateUser = async (userId, userData) => {
  const { username, email, age } = userData;
  const client = await pool.connect();
  try {
    const result = await client.query(
      "UPDATE users SET username = $1, email = $2, age = $3 WHERE id = $4 RETURNING *",
      [username, email, age, userId]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

const patchUser = async (userId, userData) => {
  if (Object.keys(userData).length === 0) {
    throw new Error("No update data provided");
  }

  const client = await pool.connect();
  try {
    let query = "UPDATE users SET ";
    const values = [];
    let index = 1;

    for (const key in userData) {
      // Ensure the key is a valid column name to prevent SQL injection
      if (!["username", "email", "age"].includes(key)) {
        continue; // Skip any keys that are not valid column names
      }
      query += `${key} = $${index}, `;
      values.push(userData[key]);
      index++;
    }

    if (values.length === 0) {
      throw new Error("No valid update data provided");
    }

    query = query.slice(0, -2); // Remove trailing comma and space
    query += ` WHERE id = $${index} RETURNING *`;
    values.push(userId);

    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
};

const deleteUser = async (userId) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [userId]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
};
