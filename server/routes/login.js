const express = require('express');
const bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Configuracion de google

async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
  }

//===========================================
// Login con Google
//===========================================

app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

    let usuarioGoogle = await verify(token)
            .catch( e => {
                return res.status(403).json({
                    ok: false,
                    err: e
                });
            });

    Usuario.findOne( {email: usuarioGoogle.email}, (err, usuario) => {

        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuario){
            if( usuario.google === false ){
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El usuario debe de autenticarse por la opción de google'
                    }
                });
            }  else {
                let token = jwt.sign({
                    usuario: usuario
                  }, process.env.SEED, { expiresIn: process.env.VENCIMIENTO_TOKEN });
    
                return res.json({
                    ok: true,
                    usuario,
                    token
                });
            }
        } else {
            // Si el usuario no existe se crea el nuevo usuario
            let usuario = new Usuario();

            usuario.nombre = usuarioGoogle.nombre;
            usuario.email = usuarioGoogle.email;
            usuario.img = usuarioGoogle.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save( (err, usuario) => {

                if(err){
                    res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuario
                  }, process.env.SEED, { expiresIn: process.env.VENCIMIENTO_TOKEN });
    
                return res.json({
                    ok: true,
                    usuario,
                    token
                });

            });

        }


    });

});


module.exports = app;