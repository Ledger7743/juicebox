const express = require("express");
const tagsRouter = express.Router();
// const { requireUser } = require("./utils");
const { getPostsByTagName, getAllTags } = require("../db");

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags,
  });
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  // read the tagname from the params

  try {
    // console.log(req.params);
    // const { posts } = req.params;
    const posts = await getPostsByTagName();
    res.send(posts);
    // use our method to get posts by tag name from the db
    // send out an object to the client { posts: // the posts }
  } catch ({ name, message }) {
    // forward the name and message to the error handler
  }
});

module.exports = tagsRouter;
