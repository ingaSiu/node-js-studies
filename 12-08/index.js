console.log('Hello');
const express = require('express');
const cors = require('cors');
const app = express();
// express funkcija grazina serveri i app kintamaji
const port = 3000;

const db = require('./db'); // importuojame db faila
const users = db.data; // prisiskiriam kintamajam
console.log(users);

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on the ${port}`);
});

// task 1
// sukurkite bendrini GET route, kuris paduos visus duomenis
app.get('/users', (req, res) => {
  res.send(users);
});

// task 2
// sukurkite dinamini GET route, kur URL tures automobilio marke ir pagal
// ja prafiltruos,ir grazins tik tuos zmones, kurie turi si automobili

app.get('/users/car/:carMake', (req, res) => {
  const carMake = req.params.carMake;
  const filteredUsers = users.filter((user) => {
    if (user.car.toLowerCase() === carMake.toLowerCase()) {
      return true;
    }
    return false;
  });
  if (filteredUsers && filteredUsers.length > 0) {
    res.send(filteredUsers);
  } else {
    res.status(404).send({
      error: 'Not found',
    });
  }
});

// task 3
// sukurkite dinamini GET route, kuris priims vartotojo id ir
// grazins atitinkama vartotojo object
// hint: URL parametrai visada strings, o cia id - skaicius, tad reikes konvertuoti

app.get('/users/id/:id', (req, res) => {
  const userId = +req.params.id;
  const filteredUser = users.find((user) => {
    return user.id === userId;
  });
  if (filteredUser) {
    res.send(filteredUser);
  } else {
    res.status(404).send({
      error: 'Not found',
    });
  }
});

// task 4
// sukurkite GET route, kuris grazins visus el.pastus
// grazinamas formatas: ["abc@abc.com", "bbc@bbc.com"]

app.get('/users/emails', (req, res) => {
  const emailsArr = users.map((user) => {
    return user.email;
  });
  if (emailsArr && emailsArr.length > 0) {
    res.send(emailsArr);
  } else {
    res.status(404).send({
      error: 'Not found',
    });
  }
});

// task 5
// sukurkite GET route, i kuri pasikreipus, grazins visu moteru (gender: Female)
// varda ir pavarde (formatas: ["Rita Kazlauskaite", "Monika Simaskaite"]).

app.get('/users/females', (req, res) => {
  const females = users.filter((user) => {
    return user.gender.toLowerCase() === 'female';
  });
  const femalesNames = females.map((female) => {
    return `${female.first_name} ${female.last_name}`;
  });
  if (femalesNames && femalesNames.length > 0) {
    res.send(femalesNames);
  } else {
    res.status(404).send({
      error: 'Not found',
    });
  }
});
