const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const objectId = require('mongodb').objectId;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9vuii.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        await client.connect();
        const itemCollection = client.db('watchWarehouse').collection('item');

        app.post('/login', async (req, res) => {
            const item = req.body;
            const accessToken = jwt.sign(item, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '30d'
            })
            res.send({ accessToken });
        })

        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        app.post('/items', async (req, res) => {
            const newItem = req.body;
            console.log('adding new item', newItem);
            const result = await itemCollection.insertOne(newItem)
            res.send(result)
        })

        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(_id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Watch Server');
});

app.listen(port, () => {
    console.log('listening to port', port);
})





