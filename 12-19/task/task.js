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
  console.log(`Server is running on the ${port}`);
});

app.get('/categories', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('sixth')
      .collection('categories')
      .find()
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.get('/products', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con.db('sixth').collection('products').find().toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// toje pacioje kolekcijoje padarem dvi grupes pagal categorija ir bendras tu elementu kainas(is kikivienos category)
app.get('/categoryvalue', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('sixth')
      .collection('products')
      .aggregate([
        {
          $group: {
            _id: '$category',
            price: { $sum: '$price' },
          },
        },
      ])
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// example kaip sujungti tarpusavyje dvi collections

app.get('/', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('sixth')
      .collection('categories') // jungiam per sia kolekcija
      .aggregate([
        {
          $lookup: {
            from: 'products', //kokia kolekcija noriu prijungti
            localField: 'title', //koks categories collection yra sujungiamasis zodis
            foreignField: 'category', //koks product elementas turi sujungiamaji zodi
            as: 'products', //i koki property norim ji issaugoti
          },
        },
        {
          $project: {
            //paduos kategorijas ir bendras ju sumas, bet lookup neveiks
            category: '$title',
            description: '$description',
            total: {
              $sum: '$products.price',
            },
          },
        },
      ])
      .toArray();
    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});
