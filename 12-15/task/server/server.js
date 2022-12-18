console.log('Hello');

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

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
  //can be undefined if ?sort is not provided
  const sort = req.query.sort;

  try {
    //object for sort to be used later in sort function. sorts by sort query param value
    let sortQuery = { age: sort === 'dsc' ? -1 : 1 };
    const con = await client.connect();
    const data = await con
      .db('fifth')
      .collection('pets')
      .find()
      //if sort query param has a value then sort by sortQuery obj. If not then pass null. Then sort wont happen
      .sort(sort ? sortQuery : null)
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post('/pets', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('fifth')
      .collection('pets')
      .insertOne({
        name: req.body.name,
        type: req.body.type,
        age: Number(req.body.age),
      });
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
      .db('fifth')
      .collection('pets')
      .find(filter)
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});
