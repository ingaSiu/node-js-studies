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

//vienu metu pridejome daug duomenu
app.post('/', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('third')
      .collection('purchase_orders')
      .insertMany([
        { product: 'toothbrush', total: 4.75, customer: 'Mike' },
        { product: 'guitar', total: 199.99, customer: 'Tom' },
        { product: 'milk', total: 11.33, customer: 'Mike' },
        { product: 'pizza', total: 8.5, customer: 'Karen' },
        { product: 'toothbrush', total: 4.75, customer: 'Karen' },
        { product: 'pizza', total: 4.75, customer: 'Dave' },
        { product: 'toothbrush', total: 4.75, customer: 'Mike' },
      ]);

    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// task -find the total amount of money spent by each customer

// $match: {} - filters different entries in the collection
// in example we filter all of the collection
// group - in {} we are defining the structure of the information we want to get back

/*app.get('/', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('third')
      .collection('purchase_orders')
      .aggregate([
        { $match: {} },
        { $group: { _id: '$customer', total: { $sum: '$total' } } },
        { $sort: { total: -1 } },
      ])
      .toArray();

    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});*/
// _id of the collection we got back is name of the customer
// total returns how much the customer spend

// task - how much money was spent on each product

// app.get('/', async (req, res) => {
//   try {
//     const con = await client.connect();
//     const data = await con
//       .db('third')
//       .collection('purchase_orders')
//       .aggregate([
//         { $match: {} },
//         { $group: { _id: '$product', total: { $sum: '$total' } } },
//         { $sort: { total: -1 } },
//       ])
//       .toArray();

//     await con.close();
//     res.send(data);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// filter by customer

/*app.get('/', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('third')
      .collection('purchase_orders')
      .aggregate([
        { $match: { customer: { $in: ['Mike', 'Karen'] } } },
        { $group: { _id: '$customer', total: { $sum: '$total' } } },
        { $sort: { total: -1 } },
      ])
      .toArray();

    await con.close();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});*/

// kelios naudingos funkcijos
// find out how many toothbrushes were sold
// count - used for counting specific entry in a specific field
/*app.get('/', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('third')
      .collection('purchase_orders')
      .count({ product: 'toothbrush' })
      .toArray();
    await con.close();
    console.log('test');
    console.log(data);
    res.send({ count: data });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.toString() });
  }
});*/

// find a list of all products sold
app.get('/', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con
      .db('third')
      .collection('purchase_orders')
      .distinct('product');

    await con.close();
    console.log(data);
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});
