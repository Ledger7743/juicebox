// grab our client with destructuring from the export in index.js
//this page is where you drop tables, create tables, and initialize information for your database
const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  getAllPosts,
  getUserById,
  updatePost,
  getPostsByUser,
} = require("./index");

// async function testDB() {
//     try {
//         //connect the client to the database, finally
//         client.connect();

//         //queries are promises, so we can await them
//         //remember async function means the function always returns a promise.
//         //the await keyword works only inside async functions and makes JS wait until the promise is resolved and returns its result
//             // const result = await client.query(`SELECT * FROM users;`);
//  //for now, logging is a fine way to see what's up
//             // console.log(result);

//         //in general we will be accessing the rows field.
//             // const { rows } = await client.query(`SELECT * FROM users;`);
//             // console.log(rows);

//         const users = await getAllUsers();
//         console.log(users);
//     }   catch (error) {
//         console.error(error);
//     }   finally {
//         // it's important to close out the client connection
//         client.end();
//     }
// }

// this function should call a query which drops all tables from our database
async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
    // we pass the error up to the function that calls dropTables
  }
}

//this function should call a query that creates all tables for our databases
async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true 
            
        );

        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );
        `);
    // good news is that we don't have to pass in a value for "active", our table will set it for us when the user is inserted b/c of that"DEFAULT true"

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
    //we pass the error function that calls CreateTables
  }
}

//new function should attempt to create new users
async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    await createUser({
      username: "albert",
      password: "bertie99",
      name: "Albert Norris",
      location: "Ohio",
    });
    await createUser({
      username: "sandra",
      password: "2sandy4me",
      name: "Sandra Healy",
      location: "North Carolina",
    });
    await createUser({
      username: "glamgal",
      password: "soglam",
      name: "Glama Dimadome",
      location: "LA",
    });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    console.log("Making new post...");
    await createPost({
      authorId: albert.id,
      title: "First Post",
      content: "This is my first post. I hope I love writing blogs as much...",
    });

    await createPost({
      authorId: sandra.id,
      title: "First Post from the sea",
      content:
        "This is my first post as sandy the squirell. I hope I love writing blogs as much...",
    });

    await createPost({
      authorId: glamgal.id,
      title: "First Post for glamgal",
      content: "This is my first post. I hope I love writing blogs as much...",
    });
    console.log("created my first post!");
  } catch (error) {
    console.log("Error creating post!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content",
    });
    console.log("Result:", updatePostResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());

// .then() can be used once the promise is resolved to work with the result.
