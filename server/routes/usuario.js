const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaRole_Admin } = require('../middleware/authenticacion');

const app = express();


app.get('/usuario', verificaToken, (req, res, next) => {

   /*  return res.json({
        usuario: req.usuario
    });
 */
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Usuario.find({ estado: true }, 'email nombre estado role google img')
            .skip(desde)
            .limit(limite)
            .exec( (err, usuarios) => {

                if(err){
                    return res.status(400).json({
                        ok: false,
                        error: err
                    });
                }

                Usuario.countDocuments({ estado: true }, (err, conteo) => {

                    if(err){
                        res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        usuarios,
                        conteo
                    });
                });

            });


  
  });
  
  app.post('/usuario', [verificaToken, verificaRole_Admin], (req, res) => {
  
      let body = req.body;

      let usuario = new Usuario({

        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

      });

      usuario.save( (err, usuarioDB) => {

        if(err){
            res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

      });
  
  });
  
  app.put('/usuario/:id', verificaToken, (req, res) => {
  
      let id = req.params.id;
      let body = _.pick( req.body, ['nombre', 'email', 'img', 'role', 'estado'] );
      
      Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {

        if(err){
            res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            usuario: usuarioDB
        });

      });
  
      
  
  });
  
app.delete('/usuario/:id', [verificaToken, verificaRole_Admin], (req, res) => {

    let id = req.params.id;

    let cambioEstado = {
        estado: false
    };

    /* Usuario.findByIdAndRemove( id, (err, usuario) => { */
    
    Usuario.findByIdAndUpdate( id, cambioEstado, {new: true, context: 'query'}, (err, usuario) => {

        if(err){
            res.status(400).json({
                ok: false,
                err
            });
        }
        console.log(usuario);
        if(usuario.estado === false){
            res.status(400).json({
                ok: false,
                err: {
                    messaje: 'El usuario ya esta inactivo.'
                }
            });
        }


        // Utilizar en caso que desee eliminar el usuario.
        /* if (!usuario){
            res.status(400).json({
                ok: false,
                err: 'El usuario no existe.'
            });
        } */

        res.json({
            ok: true,
            usuario
        });
    });


  
});


module.exports = app;