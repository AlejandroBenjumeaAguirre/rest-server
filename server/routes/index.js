const express = require('express');

const app = express();

app.use( 
    require('./usuario'),
    require('./login'),
    require('./categoria'),
    require('./producto')
);


module.exports = app;