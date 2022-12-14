console.log("Hello");

require("dotenv").config();
//npm init - sukuria package.json faila

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080; //pakeistas del env failo
//jeigu neimportavo .env failo:
// 1. patikrinti kintamuju pavadinimus
//2. modulio importavima ir config paleidima
//3. .env failas turi buti root folderyje prie package.json

app.use(cors());
app.use(express.json()); //is JSON i JS
//reikalinga funcija, priimant is POST duomenis

let cars = [
    {
        id: 1,
        make: "BMW",
        model: "530",
        color: "Black",
    },
    {
        id: 2,
        make: "Subaru",
        model: "STI",
        color: "Blue",
    },
];

app.get("/cars", (req, res) => {
    res.send(cars);
});

app.get("/cars/:id", (req, res) => {
    const id = Number(req.params.id); //nes be number butu string
    const car = cars.find((car) => car.id === id) || null;
    console.log(car);
    if (car) {
        res.send(car);
    } else {
        res.status(404).send({
            error: "Car not found",
        });
    }
    console.log(id);
    console.log(car);
});

//atsiuncia {make, model, color}
//gauna {id, make, model, color}

app.post("/cars", (req, res) => {
    const car = req.body;
    if (car.make && car.model && car.color) {
        const newCar = { ...car, id: Date.now() };
        cars.push(newCar);
        res.send(newCar);
    } else {
        res.status(400).send({
            error: "Invalid request",
        });
    }
});

app.put("/cars/:id", (req, res) => {
    const id = Number(req.params.id);
    const userCar = req.body; //user atsiusta nauja versija objekto
    if (userCar.make && userCar.model && userCar.color) {
        let editedCars = [];
        /*cars.forEach((car) => {
            if (car.id === id) {
                //user car neturi id tai reikia ji susikurti ir prilyginti senos car
                userCar.id = car.id;
                editedCars.push(userCar);
            } else {
                editedCars.push(car);
            }
        });*/
        editedCars = cars.map((car) => {
            if (car.id === id) {
                userCar.id = car.id;
                return userCar;
            }
            return car;
        });
        cars = editedCars;
        res.send(userCar);
    } else {
        res.status(400).send({
            error: "Invalid request",
        });
    }
});

app.delete("/cars/:id", (req, res) => {
    const id = Number(req.params.id);

    const filteredCars = cars.filter((car) => {
        if (car.id !== id) {
            return true;
        } else {
            return false;
        }
    });
    cars = filteredCars;
    res.send("");
});

app.listen(port, () => {
    console.log(`Server is running on the ${port}`);
});

//Pasirašyti back-end papildomus du API. PUT(updatina) ir DELETE (ištrina).
