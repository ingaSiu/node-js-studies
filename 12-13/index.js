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

//ternary israiska: jeigu yra {brand} tai grazina objects su irasyta brand
//jei yra {} tai grazina viska
//kaip padaryti, kad butu to lowercase??
app.get('/', async (req, res) => {
  const { brand, sort } = req.query;
  /*
  const brand = req.query.brand;
  const sort = re.query.sort;
  */
  try {
    const con = await client.connect(); //prisijungimas prie duomenu bazes
    const data = await con
      .db('first')
      .collection('cars')
      .find(brand ? { brand } : {})
      .sort(sort ? { brand: sort === 'asc' ? 1 : -1 } : {}) //asc || kitu atveju daro descending
      /*
      let sortNumber;
      if (sort === 'asc') {
        sortNumber = 1;
      } else {
        sortNumber = -1;
      }
      */
      .toArray(); // duomenu istraukimas
    await con.close(); // DB prisijungimo isjungimas
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

//neveikia sitas, neparodo object by id
// app.get('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const con = await client.connect(); //prisijungimas prie duomenu bazes
//     const data = await con.db('first').collection('cars').findOne(ObjectId(id));
//     await con.close(); // DB prisijungimo isjungimas
//     res.send(data);
//   } catch (error) {
//     res.status(500).send({ error });
//   }
// });

//pavyzdys kaip surasti po kelis brand is karto:
//split splttins uzrasytus brand per kableli
//jei viena brand, tai vietoj brand.spilt rasom [brand]
// app.get('/', async (req, res) => {
//   const { brand, sort } = req.query;
//   try {
//     const con = await client.connect();
//     const data = await con
//       .db('first')
//       .collection('cars')
//       .find(brand ? { $or: [{ brand: { $in: brand.split(',') } }] } : {})
//       .sort(sort ? { brand: sort === 'asc' ? 1 : -1 } : {})
//       .toArray();
//     await con.close();
//     res.send(data);
//   } catch (error) {
//     res.status(500).send({ error });
//   }
// });

app.post('/', async (req, res) => {
  try {
    const con = await client.connect(); //prisijungimas prie duomenu bazes
    const data = await con
      .db('first')
      .collection('cars')
      .insertOne({ brand: req.body.brand, model: req.body.model });
    await con.close(); // DB prisijungimo isjungimas
    res.send(data);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on the ${port}`);
});
