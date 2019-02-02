'use strict';

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const app = express();


require('./config/config');
const port = process.env.PORT;

const urlencodedParser = bodyParser.urlencoded({
    extended: false
});
const jsonParser = bodyParser.json();
app.use(urlencodedParser);
app.use(jsonParser);
app.use(require('./routes/usuario'));




mongoose.connect(process.env.URL_DB, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }, (err, res) => {
    if (err) throw err;
    console.log('Conexión a base de datos establecida');
});
app.listen(port, () => {
    console.log(`Aplicacion corriendo en el puerto: ${port}`);
});