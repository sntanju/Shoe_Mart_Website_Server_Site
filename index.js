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
        const productDetailsCollection = database.collection('productDetails');

        //GET Products API
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const size = parseInt(req.query.size);
            const products = await cursor.limit(size).toArray();
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

        
        // GET productDetails API
        app.get('/productDetails', async(req, res) => {
            const cursor = productDetailsCollection.find({});
            const productDetails = await cursor.toArray();
            res.send(productDetails);
        })

        // POST productDetails API
        app.post('/productDetails', async (req, res) => {
            const productDetails = req.body;
            console.log('hit the post api', productDetails);

            const result = await productDetailsCollection.insertOne(productDetails);
            console.log(result);
            res.json(result)
        })

        // // POST MyBooking API
        // app.get("/productDetails/:email", async (req, res) => {
        //     const cursor = productDetailsCollection.find({email: req.params.email});
        //     const productDetails = await cursor.toArray();
        //     res.send(productDetails);
        //   });

        //   //DELETE MyBooking API 
        // app.delete('/mybookings/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = {_id:ObjectId(id)};
        //     const result = await bookingsCollection.deleteOne(query);
        //     res.json(result);
        // })

        //DELETE productDetails API 
        // app.delete('/productDetails/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = {_id:ObjectId(id)};
        //     const result = await productDetailsCollection.deleteOne(query);
        //     res.json(result);
        // })
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
})