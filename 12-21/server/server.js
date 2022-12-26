console.log('Hello');

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.URI;
//console.log(uri);

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri);

app.listen(port, () => {
  console.log(`Servers is running on the ${port}`);
});

process.on('exit', () => {
  client.close();
  console.log(' Exit app closed...');
});

process.on('SIGINT', () => {
  //close mongodb client when exting server
  client.close();
  console.log(' Sigint app closed...');
});

app.get('/memberships', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('membership_task')
      .collection('services')
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'serviceId',
            as: 'users',
          },
        },
        {
          $project: {
            _id: '$_id',
            name: '$name',
            price: '$price',
            description: '$description',
            //counts the joined users collection on each membership
            userCount: { $size: '$users' },
          },
        },
      ])
      .toArray();
    //conneciton close creates problems when two requests are made at same time
    //await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

app.get('/users', async (req, res) => {
  //can be undefined if ?sort is not provided
  //?sort=asc ar dsc
  const sort = req.query.sort;
  try {
    //object for sort to be used later in sort function. sorts by sort query param value
    let sortQuery = { name: sort === 'dsc' ? -1 : 1 };
    const con = await client.connect();
    const data = await con
      .db('membership_task')
      .collection('users')
      .aggregate([
        {
          $lookup: {
            from: 'services',
            localField: 'serviceId',
            foreignField: '_id',
            as: 'membership',
          },
        },
        {
          $project: {
            name: '$name',
            surname: '$surname',
            email: '$email',
            membership: { $first: '$membership.name' },
          },
        },
      ])
      //TODO remove sorting if sort is undefined
      .sort(sort ? sortQuery : sortQuery)
      .toArray();
    //await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

app.post('/memberships', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('membership_task')
      .collection('services')
      .insertOne({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
      });
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

app.post('/users', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('membership_task')
      .collection('users')
      .insertOne({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        serviceId: ObjectId(req.body.serviceId),
      });
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

app.delete('/memberships/:id', async (req, res) => {
  const id = req.params.id;
  try {
    if (id) {
      const con = await client.connect();
      const filter = { _id: ObjectId(id) };
      const data = await con
        .db('membership_task')
        .collection('services')
        .deleteOne(filter);
      await con.close();
      res.send(data);
    } else {
      res.status(400).send();
    }
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});
