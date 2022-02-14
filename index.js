const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;


// middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dngm2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri)

async function run() {
  try {
    await client.connect();
    const database = client.db("blogCollection");
    const allBlogCollection = database.collection("blogs");
    const allCommentCollection = database.collection("comments");

    app.post('/blogs', async (req, res) => {
      const blog = req.body;
      const result = await allBlogCollection.insertOne(blog)
      res.json(result)
    })

    app.get('/blogs', async (req, res) => {
      const result = await allBlogCollection.find({}).toArray();
      res.json(result)
    })

    app.get('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allBlogCollection.findOne(query);
      res.json(result);
    })

    app.post('/comments', async (req, res) => {
      const blog = req.body;
      const result = await allCommentCollection.insertOne(blog)
      res.json(result)
      console.log(result)
    })

    app.get('/comments', async (req, res) => {
      const result = await allCommentCollection.find({}).toArray();
      res.json(result);
    })

    app.get('/comments', async (req, res) => {
      // console.log(req)
      // const query = { _id: ObjectId(id) };
      // const result = await allCommentCollection.findOne(query);
      // res.json(result);
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening very carefully at http://localhost:${port}`);
});