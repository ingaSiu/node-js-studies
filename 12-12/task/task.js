console.log('Hello');

require('dotenv').config();
//npm init - sukuria package.json faila

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080; //pakeistas del env failo
//jeigu neimportavo .env failo:
// 1. patikrinti kintamuju pavadinimus
//2. modulio importavima ir config paleidima
//3. .env failas turi buti root folderyje prie package.json
const { MongoClient } = require('mongodb');
//importuojame mongo client

const uri = process.env.URI;
console.log(uri);

//prisijungimo objektas prie cluster duomenu bazes
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

// pasirasom route, kuris tiesiog pasakys, kad viskas veikia
app.get('/', async (req, res) => {
  try {
    const con = await client.connect(); //prisijungimas prie duomenu bazes
    const data = await con.db('second').collection('people').find().toArray(); // duomenu istraukimas
    await con.close(); // DB prisijungimo isjungimas
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post('/', async (req, res) => {
  try {
    const con = await client.connect(); //prisijungimas prie duomenu bazes
    const data = await con.db('second').collection('people').insertOne({
      name: req.body.name,
      surname: req.body.surname,
      age: req.body.age,
    });
    await con.close(); // DB prisijungimo isjungimas
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on the ${port}`);
});
