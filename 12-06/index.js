// Express.js pagrindai

//irasius express package, importuojame express (modulis)instance
const express = require("express");
//is express modulio galima sukurti app
//app yra musu aplikacija ant kurios viskas bus statoma
const app = express(); //app yra express instance, tai ka express sukuria
//port -kanalas, nusirodomas kaip kintamasis
const port = 3000;

//req - request- duomenys, kuriuos paduoda user,
//pvz. POST user duomenys, ar validacijos raktas

//res - response - duomenys, kuriuos grazinam, kai kviecia
//musu API keliu "/"
//apsirasomas musu API get:
//pirmas argumentas - kelias i musu API "/" - tai adresas mano, kad pasiekti duomenis
//antras ard - callback funcija (kai kazkas ivyksta iskvieciama funkcija)

app.get("/", (req, res) => {
    res.send("Hello World"); //i response siuncoam 'hello world'
});
//calback funkcija istransliuoja, kad musu app veiks ir jis sukasi ant port (tas, kuris pazymetas)
//app.listen - keyword, kuris nusako, kad musu programa turi klausytis
//kaip npm start - serveris pradeda klausytis ir jis neissijungia, kol jo pats neisjungi
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    console.log(`Server is running on the ${port} port`);
    //kai app pasileidzia, paleidziama komanda, kad matytumem, kad viskas veikia
});
//importuojame cors, cors() - iskvieciam cors funkcijos returnas (instance)
//cors - be skliaustuku yra tiesiog kaip funkcijos reference
const cors = require("cors");
//use - papildomi parametrai
app.use(cors());

//all requests and responses now will be in format of json (prirasytas per task su users)
app.use(express.json());

//task with cars:
// const cars = ["BWM", "Porsche", "VW", "Subaru", "test4"];
// app.get("/", (req, res) => {
//     res.send(cars);
// });

//task with users:

//first part:
const users = ["Alex", "Rose", "Megan"];

app.get("/api/users", (req, res) => {
    res.send(users);
});

//second part:

//galima isivaizduoti kaip funkcija tam route
app.get("/api/users/:firstLetter", (req, res) => {
    const firstLetter = req.params.firstLetter.toLowerCase();
    //filter users by first letter and then return to user
    const filteredUsers = users.filter((name) => {
        if (name.toLowerCase().startsWith(firstLetter)) {
            return true;
        }
        return false;
    });
    //res.send yra returnas useriui
    res.send(filteredUsers);
});

//third part:

app.post("/api/users", (req, res) => {
    //if I would want to add more than one in one request. Array 'names' could be passed instead of string
    /*req.body.names.forEach(name => {
        users.push(name);
    });*/

    users.push(req.body.name);
    res.send(users);
});
