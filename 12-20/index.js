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

app.get('/users', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con.db('fifth').collection('users').find().toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post('/users', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con.db('fifth').collection('users').insertOne({
      name: req.body.name,
      email: req.body.email,
    });
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

app.post('/comments', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('fifth')
      .collection('comments')
      .insertOne({
        userId: ObjectId(req.body.userId),
        date: Date(),
        comment: req.body.comment,
      });
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

/*app.get('/users-and-comments', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('fifth')
      .collection('users')
      .aggregate([
        //this is only workaround if foreign id is saved as string and local id has to be also converted to strind
        //convert parent table ObjectId element to string and name it userId
        { $addFields: { userId: { $toString: '$_id' } } },
        {
          $lookup: {
            from: 'comments',
            localField: 'userId', // padarytas per addfields
            foreignField: 'userId', //jau egzituoja comments lentoje
            as: 'userComments',
          },
        },
      ])
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});*/

app.get('/users-and-comments', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('fifth')
      .collection('users')
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'userId',
            as: 'userComments',
          },
        },
      ])
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

app.get('/comments-with-user', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('fifth')
      .collection('comments')
      .aggregate([
        {
          //this joins users table to comments table
          $lookup: {
            //this is a table that has to be joined
            from: 'users',
            //comments table field that equals to users _id field
            localField: 'userId',
            //users table field that equals to comments userId field
            foreignField: '_id',
            //save found results from users table to new property called user
            as: 'user',
          },
        },
      ])
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

app.get('/comments', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('fifth')
      .collection('comments')
      .aggregate([
        {
          //this joins users table to comments table
          $lookup: {
            //this is a table that has to be joined
            from: 'users',
            //comments table field that equals to users _id field
            localField: 'userId',
            //users table field that equals to comments userId field
            foreignField: '_id',
            //save found results from users table to new property called user
            as: 'user',
          },
        },
        {
          //works kinda like map method. maps results of lookup in this case
          $project: {
            //provide structure of objects that have to be returned to user
            date: '$date',
            comment: '$comment',
            //lookup returns array of users in user property. Because of that we take first element of array and take user.name from there
            username: { $first: '$user.name' },
          },
        },
      ])
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

app.delete('/comments/:id', async (req, res) => {
  const id = req.params.id;
  try {
    if (id) {
      const con = await client.connect();
      const filter = { _id: ObjectId(id) };
      const data = await con
        .db('fifth')
        .collection('comments')
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
