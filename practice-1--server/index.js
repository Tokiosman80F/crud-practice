const express = require("express");
const app = express();
const port = 3000;
// middle ware
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello Conceptual World!");
});
// --dot env---
require("dotenv").config();
// ------Mongodb------

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.BUCKET}:${process.env.BUCKET_KEY}@cluster0.lyiobzh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("userDatabase").collection("userDetail");

    // post
    app.post("/userDetail", async (req, res) => {
      const user = req.body;
      console.log("the user", { user });
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    // get
    app.get("/userDetail", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    // delete
    app.delete("/userremoved/:id", async (req, res) => {
      const id = req.params.id;
      const userId = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(userId);
      console.log("result", { result });
      res.send(result);
    });
    // get single data
    app.get("/singleUser/:id", async (req, res) => {
      const id = req.params.id;
      const userId = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(userId);
      res.send(result);
    });
    // updating the edit data
    app.put("/updateInfo/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      console.log("update=>", id);
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const update = {
        $set: {
          name: body.name,
          email: body.email,
        },
      };

      const result = await userCollection.updateOne(query, update, options);
      console.log(result);
      res.send(result); 
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
