require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
    return res
      .status(401)
      .send({ message: "unauthorise user ,token not found" });
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
    const RequestPartnerCollection = db.collection("partnerRequest");
    // apis partner
    app.get("/partners", async (req, res) => {
      try {
        const query = req.query;
        const cursor = partnerCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } catch {
        res.status(500).send({ message: "something went wrong" });
      }
    });
    app.get("/partners/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await partnerCollection.findOne(query);
        if (!result) {
          return res.status(404).send({ message: "Partner not found" });
        } else {
          res.send(result);
        }
      } catch (err) {
        res.status(500).send({ message: "Invalid ID" });
      }
    });
    app.post("/partners", verificationToken, async (req, res) => {
      const query = req.body;
      const result = await partnerCollection.insertOne(query);
      res.send(result);
    });
    // ratting
    app.patch("/partners/:id", verificationToken, async (req, res) => {
      const { rating } = req.body;
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid Partner ID format." });
      }

      const numberRatting = parseInt(rating);
      if (isNaN(numberRatting) || numberRatting < 1 || numberRatting > 5) {
        res.status(400).send({ message: "invaild ratting" });
      }

      const query = { _id: new ObjectId(id) };
      const rattingObject = {
        $inc: { totalRatting: numberRatting, rattingCount: 1 },
      };
      const result = await partnerCollection.updateOne(query, rattingObject);
      res.send(result);
    });
    // post request
    app.post("/RequestPartner", verificationToken, async (req, res) => {
      try {
        const NewRequest = req.body;
        const partnerId = NewRequest.PartnerId;
        const userEmail = NewRequest.userEmail;

        const existingRequest = await RequestPartnerCollection.findOne({
          PartnerId: partnerId,
          userEmail: userEmail,
        });

        if (existingRequest) {
          return res
            .status(409)
            .send({ message: "Request already sent by this user." });
        }

        const result = await RequestPartnerCollection.insertOne(NewRequest);

        const updateQuery = { _id: new ObjectId(partnerId) };
        const countUpdate = { $inc: { partnerCount: 1 } };
        await partnerCollection.updateOne(updateQuery, countUpdate);

        res.send(result);
      } catch (error) {
        console.error("Error in /RequestPartner:", error);
        res.status(500).send({ message: "Failed to process Request" });
      }
    });

    // Partner Request get
    app.get("/RequestPartner", async (req, res) => {
      try {
        const email = req.query.email;
        const query = { email: email };
        const cursor = RequestPartnerCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } catch {
        res.status(500).send({ message: "Invalid User" });
      }
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
