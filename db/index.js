// // building database connection - require the pg package
// this page is where you import pg module and set up your client so that you can connect to your database

const { Client } = require("pg");
//imports the pg module

const client = new Client("postgres://localhost:5432/juicebox-dev");
//supply the db name and location of the database

async function createUser({ username, password, name, location }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
            INSERT INTO users(username, password, name, location)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
         `,
      [username, password, name, location]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  //build the set string
  // variable setString = objectconstructor keys in the fields parameter
  // constructor is a special method that is used to initialize objects. The constructor is called when an object of a class is created.
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
          UPDATE users
          SET ${setString}
          WHERE id =${id}
          RETURNING *;
          `,
      Object.values(fields)
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const { rows } = await client.query(
      `SELECT id,
        username,
        name,
        location,
        active FROM users;
        `
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  /* first, get the user (remember the query returns - try catch + await) */
  try {
    const {
      rows: [user],
    } = await client.query(`
              SELECT id,
              username,
              name,
              location,
              active FROM users
              WHERE id=${userId}
          `);

    /* if user doesn't exist (no 'rows' or 'rows.length'), return null */
    if (!user) {
      return null;
    }

    /*Not sure where "if user exists, delete the 'password' key from the returned object" */

    /* get their posts (user getPostsByUser) */
    /* add their posts to the user object with key 'posts' */
    user.posts = await getPostsByUser(userId);
    return user;
  } catch (error) {
    throw error;
  }
}

async function createPost({ authorId, title, content }) {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
        INSERT INTO posts("authorId", title, content)
        VALUES($1, $2, $3)
        RETURNING *;
    `,
      [authorId, title, content]
    );

    return post;
  } catch (error) {
    throw error;
  }
}

async function updatePost(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [post],
    } = await client.query(
      `
            UPDATE posts
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
             `,
      Object.values(fields)
    );

    return post;
  } catch (error) {
    throw error;
  }
}

async function getAllPosts() {
  try {
    const { rows } = await client.query(`
        SELECT *
        FROM posts;
        `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(`
            SELECT * FROM posts 
            WHERE "authorId"=${userId};
            `);

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById,
};
