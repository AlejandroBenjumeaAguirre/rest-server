const express = require('express');

const app = express();

app.use( 
    require('./usuario'),
    require('./login') 
);


module.exports = app;