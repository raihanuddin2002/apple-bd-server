const express = require('express');
const app = express();
const {MongoClient} = require("mongodb"); 
const env = require('dotenv').config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DATABASE 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svqjf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try{
        await client.connect(); 
        const database = client.db("applebd");
        const productsCollention = database.collection("products");
        
        // GET API
        app.get("/products", async (req,res) => {
            const cursor = productsCollention.find({});
            const products =await cursor.toArray();
            res.send(products);
        });
        app.get("/productsLimit", async (req,res) => {
            const cursor = productsCollention.find({}).limit(6);
            const products =await cursor.toArray();
            res.send(products);
        });
        app.get("/products/:id", async (req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await productsCollention.findOne(query);
            res.send(service);
        });
        app.post("/products", async (req,res) => {
            const serviceInfo = req.body.serviceInfo;
            const service = await productsCollention.insertOne(serviceInfo);
            res.send(service);
        });
    }finally{

    }

    // Order
    try{
        await client.connect(); 
        const database = client.db("applebd");
        const productsCollention = database.collection("applebdOrders");
        
        // GET API
        app.get("/allOrders", async(req,res) => {
            const cursor = productsCollention.find({});
            console.log("Hitting the url");
            const result = await cursor.toArray();
            res.send(result);
        })
        // POST API
        app.post("/placeOrder/:id", async (req,res) => {
            const user = req.body;
            const result = await productsCollention.insertOne(user);
            res.send(result);
        });

        app.post("/myOrders", async (req,res) => {
            const userEmail = req.body.userEmail;
            const cursor =productsCollention.find({});
            const result = await cursor.toArray();
            const newResult = result.filter(newResult => newResult.email === userEmail);
            res.send(newResult);
        });

         // PUT API
        app.put("/products/:id", async (req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    orderStatus: `Approved`
                },
              };
            const service = await productsCollention.updateOne(query,updateDoc,options);
            res.send(service);
        });

        //    DELETE API
        app.delete("/myOrders/:id", async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollention.deleteOne(query);
            res.send(result);
        });
    }finally{

    }

    // Users
    try{
        await client.connect(); 
        const database = client.db("applebd");
        const productsCollention = database.collection("users");

        // POST METHOD
        app.post("/saveUsers", async (req,res) => {
            const saveUser = req.body.saveUserInfo;
            const result = await productsCollention.insertOne(saveUser);
            res.send(result);
        });

    }finally{

    }
}
run().catch(console.dir());


// Basic
app.get("/", (req,res) => {
    res.send("Apple BD Server Running...");
});

app.listen(port, () => {
    console.log("Server Running on port:", port);
});