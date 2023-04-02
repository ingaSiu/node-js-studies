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

// const url = 'https://randomuser.me/api/';

/*fetch('https://randomuser.me/api/')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });*/

const getRandomName = async () => {
  const response = await fetch('https://randomuser.me/api/');
  const jsonBody = await response.json();
  console.log('FETCHED:');
  console.log(jsonBody);
  return `${jsonBody.results[0].name.first} ${jsonBody.results[0].name.last}`;
};

app.get('/', async (req, res) => {
  try {
    const newName = await getRandomName();
    const con = await client.connect();
    const insertData = await con.db('people').collection('names').insertOne({
      name: newName,
    });
    if (insertData) {
      const data = await con.db('people').collection('names').find().toArray();
      console.log('test inserted');
      res.send(data);
      return;
    }
    res.send('DID NOT INSERT');
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});
