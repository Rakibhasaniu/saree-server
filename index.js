const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PROT || 5000;
// Security
require("dotenv").config();

//Middle ware
app.use(cors());
app.use(express.json());

// =========Mongodb conntection Build===============
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@rasel-01.uhpxwkk.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://samantha:Lz2nnQ78gpNQSkQB@cluster0.48q4yql.mongodb.net/`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// console.log(uri);

async function run() {
  const All_Furnitures = client
    .db("Samantha_Collections")
    .collection("All_Saree");
  const UpComing_Furnitures = client
    .db("Samantha_Collections")
    .collection("Upcoming_Saree");
  const AddTo_Card = client.db("Samantha_Collections").collection("card_Lisht");
  const User_Collections = client
    .db("Samantha_Collections")
    .collection("User_Collections");

  try {
    // all product Get to mongodb server site APi link use client site
    app.get("/all_product", async (req, res) => {
      const Products = {};
      const resule = await All_Furnitures.find(Products).toArray();
      res.send(resule);
    });
    // Upcoming Furniture
    app.get("/upcomin_furnituers", async (req, res) => {
      const Products = {};
      const resule = await UpComing_Furnitures.find(Products).toArray();
      res.send(resule);
    });
    app.get("/Detail_product/:id", async (req, res) => {
      const id = req.params.id;
      const Products = { cetagory: id };
      const resule = await All_Furnitures.find(Products).limit(3).toArray();
      res.send(resule);
    });
    // Mongodb database filtaring cetagory base product
    app.get("/cetagory/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { category: id };
      const result = await All_Furnitures.find(quary).toArray();
      res.send(result);
    });
    // Product Details
    app.get("/porduct-Details/:id", async (req, res) => {
      const id = req.params.id;
      const product = { _id: ObjectId(id) };
      const result = await All_Furnitures.findOne(product);
      res.send(result);
    });
    // Post Add To Card product route add to product
    app.post("/addCard", async (req, res) => {
      const product = req.body;
      const result = await AddTo_Card.insertOne(product);
      res.send(result);
    });
    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      const result = await All_Furnitures.insertOne(product);
      res.send(result);
      console.log(result);
    });
    // delete card

    app.delete("/deleteCard/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await AddTo_Card.deleteOne(filter);
      res.send(result);
    });

    app.get("/allCard/:id", async (req, res) => {
      const userEmail = req.params.id;
      const qurey = { email: userEmail };
      const result = await AddTo_Card.find(qurey).toArray();
      res.send(result);
    });

    //Pement section
    app.get("/payment/:id", async (req, res) => {
      const id = req.params.id;
      const product = { _id: ObjectId(id) };
      const result = await All_Furnitures.findOne(product);
      res.send(result);
    });

    // user collections to post mongoDB
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await User_Collections.insertOne(user);
      res.send(result);
    });
    // to get all user
    app.get("/users", async (req, res) => {
      const qurey = {};
      const result = await User_Collections.find(qurey).toArray();
      res.send(result);
    });

    // to get only Admin
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await User_Collections.findOne(query);
      res.send(result);
    });
  } catch (err) {
    console.log(err);
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("furniture server is runing");
});

app.listen(port, () => {
  console.log(`Furniture Server is run ${port}`);
});
