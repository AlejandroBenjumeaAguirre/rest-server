const express = require('express');

const fs = require('fs');
const path = require('path');

const { verificaTokenUrl } = require('../middleware/authenticacion');

const app = express();


app.get('/imagen/:tipo/:img', verificaTokenUrl, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else{
        let noimagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noimagePath);
    }

    





});


module.exports = app;