//console.log("Hello Inga!" + 3 * 5);

const casual = require("casual");

console.log(casual.city);

const randomNum = () => {
    return Math.floor(Math.random() * 10) + 1;
};
console.log(randomNum());
console.log(`${casual.name_prefix} ${casual.first_name} ${casual.last_name}`);
