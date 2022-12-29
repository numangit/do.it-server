const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//connection with mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zbie1as.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        //database collections
        const tasksCollection = client.db('doit').collection('tasks');
    }
    finally {
    }
}

run().catch(console.log)

app.get('/', async (req, res) => {
    res.send('Do.it server is running')
});

app.listen(port, () => {
    console.log(`Do.it running on ${port}`)
});