console.log('Hello');

require('dotenv').config();
//npm init - sukuria package.json faila

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080; //pakeistas del env failo

const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.URI;
console.log(uri);

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri);

app.listen(port, () => {
  console.log(`Server is running on the ${port}`);
});

app.get('/pets', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con.db('fourth').collection('pets').find().toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post('/pets', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con.db('fourth').collection('pets').insertOne({
      name: req.body.name,
      type: req.body.type,
      age: req.body.age,
    });
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.get('/pets/byoldest', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('fourth')
      .collection('pets')
      .find()
      .sort({ age: -1 })
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.get('/pets/:type', async (req, res) => {
  try {
    const type = req.params.type;
    const con = await client.connect();
    const filter = { type: type };
    const data = await con
      .db('fourth')
      .collection('pets')
      .find(filter)
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});
