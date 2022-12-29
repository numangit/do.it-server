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

        //api to get tasks by user email
        app.get('/myTasks', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    userEmail: req.query.email
                }
            }
            const cursor = tasksCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });

        //api to get specific task by id
        app.get('/myTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const task = await tasksCollection.findOne(query);
            res.send(task);
        });

        //api to add tasks data 
        app.post('/myTasks', async (req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            res.send(result);
        });

        //api to delete task
        app.delete('/myTasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
        })

        //api to add the completed field on task
        app.put('/myTasks/completed/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    completed: true
                }
            }
            const result = await tasksCollection.updateOne(query, updatedDoc, options);
            res.send(result);
        })

        //api to update the task
        app.patch('/myTasks/:id', async (req, res) => {
            const id = req.params.id;
            const taskName = req.body.taskName
            const taskDescription = req.body.taskDescription
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    taskName: taskName,
                    taskDescription: taskDescription
                }
            }
            const result = await tasksCollection.updateOne(query, updatedDoc);
            res.send(result);
        })
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