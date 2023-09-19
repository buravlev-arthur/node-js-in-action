const express = require("express");
const kraken = require("kraken-js");
const adaro = require("adaro");

const app = express();

// подключение фреймворка KrakenJS
app.use(kraken());

// подключение парсера шаблонов LinkedIn’s Dust (модуль "adaro")
app.engine("dust", adaro.dust());
app.set("view engine", "dust");

app.listen(3000, () => {
  console.log("Kraren run on http://localhost:3000");
});
