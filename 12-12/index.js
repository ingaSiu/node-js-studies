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

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on the ${port}`);
});

let data = [
  {
    title: 'wan',
    id: 1,
    body: 'wanwan',
  },
  {
    title: 'wan1',
    id: 2,
    body: 'wanwan1',
  },
  {
    title: 'wan3',
    id: 3,
    body: 'wanwan3',
  },
];

//req is what user sends to server, res is what server sends back to user
/*app.get('/posts', (req, res) => {
  //example of query param ?page=1
  //let page = req.query.page;
  res.send(data);
});*/

app.get('/posts/:id', (req, res) => {
  const id = +req.params.id;
  const user = data.find((user) => {
    return user.id === id;
  });
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({
      error: 'Not found',
    });
  }
});

app.get('/posts', (req, res) => {
  const title = req.query.title;
  if (title) {
    const filteredTitle = data.filter((element) => {
      return title.toLowerCase() === element.title.toLowerCase();
    });
    res.send(filteredTitle);
  } else {
    res.send(data);
  }
});

app.post('/posts', (req, res) => {
  const userData = req.body;
  if (userData.title && userData.body) {
    const newData = { ...userData, id: Date.now() };
    data.push(newData);
    res.send(newData);
  } else {
    res.status(400).send({
      error: 'Invalid request',
    });
  }
});

app.put('/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const newData = req.body;
  if (newData.title && newData.body) {
    let editedData = [];
    editedData = data.map((element) => {
      if (element.id === id) {
        newData.id = element.id;
        return newData;
      }
      return element;
    });
    data = editedData;
    res.send(newData);
  } else {
    res.status(400).send({
      error: 'Bad request',
    });
  }
  //siuncia body, is route reikia id paimti ir prideti prie body
  //nes kitaip user nebus priskirtas id
  //user.id = id; //kai pasiselcetini id, priskiri id arba su date daryt
});

app.delete('/posts/:id', (req, res) => {
  const id = +req.params.id;

  const filteredData = data.filter((element) => {
    if (element.id !== id) {
      return true;
    } else {
      return false;
    }
  });
  data = filteredData;
  res.send('');
});
