require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const admin = require("firebase-admin");

const serviceAccount = require("./study-mate-246e4-firebase-adminsdk-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uri = `mongodb+srv://${process.env.URI_USERNAME}:${process.env.URI_PASSWORD}@cluster0.sillvi5.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// middle ware
app.use(cors());
app.use(express.json());

// Send a ping to confirm a successful connection

// token verification

const verificationToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ message: "unauthorise user" });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "unauthorised user" });
  }
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.token_email = decoded.email;
    next();
  } catch (error) {
    return res.status(401).send({ message: "unauthorised user" });
  }
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log("mongoDB connected");
    const db = client.db("studuMateDB");
    const partnerCollection = db.collection("partners");
    // apis partner
    app.get("/partners", async (req, res) => {
      // const users = req.body;
      // const cursor = users.find();
      // const result = await cursor.toArray();
      res.send("geted");
    });
    app.post("/partners", verificationToken, async (req, res) => {
      const query = req.body;
      const result = await partnerCollection.insertOne(query);
      res.send("partner post created", result);
    });
    app.patch("/partners", async (req, res) => {
      res.send("pastch");
    });
    app.delete("/partners", async (req, res) => {
      res.send("pastch");
    });

    app.post("users", async (res, req) => {});

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// studyMate
// WY4TfIBX8gN5Ef68
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
