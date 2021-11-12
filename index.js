const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const  ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k5fnv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {

        await client.connect();
        const database = client.db('shoeMart');
        const productsCollection = database.collection('products');
        const reviewsCollection = database.collection('reviews');
        const allOrdersCollection = database.collection('allOrders');
         const usersCollection = database.collection('users');

        // GET Products API
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const size = parseInt(req.query.size);
            const products = await cursor.toArray();
            res.send(products);
        })

        // POST Products API
        app.post('/products', async (req, res) => {
            const products = req.body;
            console.log('hit the post api', products);

            const result = await productsCollection.insertOne(products);
            console.log(result);
            res.json(result)
        })

        
        // GET Reviews API
        app.get('/reviews', async(req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // POST Reviews API
        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            console.log('hit the post api',reviews);

            const result = await reviewsCollection.insertOne(reviews);
            console.log(result);
            res.json(result)
        })

        
        // GET allOrders API
        app.get('/allOrders', async(req, res) => {
            const cursor = allOrdersCollection.find({});
            const allOrders = await cursor.toArray();
            res.send(allOrders);
        })

        // POST allOrders API
        app.post('/allOrders', async (req, res) => {
            const allOrders = req.body;
            console.log('hit the post api', allOrders);

            const result = await allOrdersCollection.insertOne(allOrders);
            console.log(result);
            res.json(result)
        })

        // DELETE allOrders API 
        app.delete('/allOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await allOrdersCollection.deleteOne(query);
            res.json(result);
        })


        // Users APi
         app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin'} };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // POST MyBooking API
        app.get("/productDetails/:email", async (req, res) => {
            const cursor = productDetailsCollection.find({email: req.params.email});
            const productDetails = await cursor.toArray();
            res.send(productDetails);
          });

          // DELETE MyBooking API 
        app.delete('/productDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await productDetailsCollection.deleteOne(query);
            res.json(result);
        })

    }

    finally {

        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Shoe Mart is Running');
});

app.listen(port, () => {
    console.log('Shoe Mart is running on port', port);
});