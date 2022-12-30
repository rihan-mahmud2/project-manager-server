const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;
console.log(process.env.db_password);
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0.vjq6aig.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const userTaskCollection = client
      .db("project-manager")
      .collection("userTaskCollections");

    app.get("/userTask/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const result = await userTaskCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/userTask", async (req, res) => {
      const status = req.query.status;
      const email = req.query.email;
      console.log(status, email);
      const query = { email: email, status: status };
      const result = await userTaskCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/userTask", async (req, res) => {
      const userTask = req.body;

      const result = await userTaskCollection.insertOne(userTask);
      res.send(result);
    });

    app.put("/userTask/:id", async (req, res) => {
      const id = req.params.id;
      console.log(typeof id);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          status: "completed",
        },
      };
      const result = await userTaskCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
  } catch (err) {}
}

run().catch((err) => console.log(err));

app.get("/", async (req, res) => {
  res.send("The app is running");
});

app.listen(port, (req, res) => {
  console.log(`The server is listening on`, port);
});
