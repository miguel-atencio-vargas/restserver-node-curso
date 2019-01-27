const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./config/config');
const port = process.env.PORT;

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
app.use(urlencodedParser);
app.use(jsonParser);



app.get('/', (req, res) => {
    res.json('get Methos');
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    res.json({
        body
    });
})

app.listen(port, () => {
    console.log(`Aplicacion corriendo en el puerto: ${port}`);
});