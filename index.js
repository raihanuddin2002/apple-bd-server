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
        // DELETE API
        app.delete("/products/:id", async (req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await productsCollention.deleteOne(query);
            res.send(service);
        })
    }finally{

    }

    // Order
    try{
        await client.connect(); 
        const database = client.db("applebd");
        const productsCollention = database.collection("applebdOrders");
        const usersCollention = database.collection("users");
        
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

    try{
        // Users 
        await client.connect(); 
        const database = client.db("applebd");
        const usersCollention = database.collection("users");
        // GET API
        app.get('/users', async (req,res) => {
            const cursor = usersCollention.find({});
            const users =await cursor.toArray();
            res.send(users);
        });
        
        // POST API
        app.post("/saveUserInfo" , async(req,res) => {
            const user = req.body.saveUserInfo;
            const result = await usersCollention.insertOne(user);
            res.send(result);
        });
        app.post('/users/:email', async (req,res) => {
            const email = req.params.email;
            const query = {email: email};
            const user = await usersCollention.findOne(query);
            res.send(user);
        });

        // PUT API
        app.put("/saveUserInfo" , async(req,res) => {
            const user = req.body.saveUserInfo;
            const filter = {email: user.email};
            const options = {upsert: true};
            const updateDoc = {$set: user};
            const result = await usersCollention.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.put('/users/:id', async (req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    role: `admin`
                },
              };
            const service = await usersCollention.updateOne(query,updateDoc,options);
            res.send(service);
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