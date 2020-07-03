require('./config/config');

const express = require('express');
const app = express();
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
 

app.get('/usuario', (req, res, next) => {

  res.json('get usuario');

});

app.post('/usuario', (req, res) => {

    let body = req.body;

    res.json({
        usuario: body
    });

});

app.put('/usuario', (req, res) => {

    let id = req.params.id;

    res.json({
        id
    });

});

app.delete('/usuario', (req, res) => {

    res.json('delete usuario');

});
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
});