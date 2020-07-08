const express = require('express');
const bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();


app.post('/login', (req, res) => {

    let body  = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                errors: {
                    message: 'Usuario o contraseña incorrecta --email'
                }
            });
        }

        if( !bcrypt.compareSync( body.password, usuarioDB.password ) ){
            return res.status(400).json({
                ok: false,
                errors: {
                    message: 'Usuario o contraseña incorrecta --password'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
          }, process.env.SEED, { expiresIn: process.env.VENCIMIENTO_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });


   /*  res.json({
        ok: true,
        mensaje: 'Conectado a login'
    }); */

});





module.exports = app;