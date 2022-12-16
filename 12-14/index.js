// Turite visus API sujungti su MongoDB  Susikurti naują duomenų bazę,
//kolekcijas ir prisidėti įrašus ranka. Kai DB paruošta, pradėkite kurti API.

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

//req is what user sends to server, res is what server sends back to user
app.get('/posts', async (req, res) => {
  const title = req.query.title;
  try {
    let filter = {};
    if (title) {
      filter.title = title;
      /*
      filter = {
        title: title
      }
      */
    }
    const con = await client.connect();
    const data = await con
      .db('third')
      .collection('data')
      .find(filter)
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.get('/posts/:id', async (req, res) => {
  const id = req.params.id;
  try {
    if (id) {
      const con = await client.connect();
      const filter = { _id: ObjectId(id) };
      const data = await con.db('third').collection('data').findOne(filter);
      await con.close();
      res.send(data);
    } else {
      res.status(400).send();
    }
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post('/posts', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('third')
      .collection('data')
      .insertOne({ title: req.body.title, body: req.body.body });
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.put('/posts/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const con = await client.connect();
    if (id) {
      const filter = { _id: ObjectId(id) };
      let updateObj = {};
      if (req.body.title) {
        updateObj.title = req.body.title;
      }
      if (req.body.body) {
        updateObj.body = req.body.body;
      }
      const updateDoc = {
        $set: updateObj,
      };
      const data = await con
        .db('third')
        .collection('data')
        .updateOne(filter, updateDoc);
      await con.close();
      res.send(data);
    }
    res.send();
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.delete('/posts/:id', async (req, res) => {
  const id = req.params.id;
  try {
    if (id) {
      const con = await client.connect();
      const filter = { _id: ObjectId(id) };
      const data = await con.db('third').collection('data').delete(filter);
      await con.close();
      res.send(data);
    } else {
      res.status(400).send();
    }
  } catch (error) {
    res.status(500).send({ error });
  }
});
