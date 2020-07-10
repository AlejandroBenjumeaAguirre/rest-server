
const express = require('express');

const { verificaToken, verificaRole_Admin } = require('../middleware/authenticacion');

const app = express();

const Categoria = require('../models/categoria');

//===========================================
// Consultar categoria por id
//===========================================

app.get('categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });
});

//===========================================
// Consultar categorias
//===========================================

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
            .populate('usuario', 'nombre email')
            .exec( (err, categoriasDB) => {
                if(err){
                    return  res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Categoria.countDocuments({}, (err, conteo) => {

                    if(err){
                        res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        categoriasDB,
                        conteo
                    });
                });
            });

});


//===========================================
// Crear categorias
//===========================================

app.post('/categoria',  verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaDB) => {
        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });
});

//===========================================
// Actualizar categoria
//===========================================

app.put('/categoria/:id', [verificaToken, verificaRole_Admin], (req, res) => {

    let body = req.body;
    let id = req.params.id;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoria) => {

        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria
        });

    });

});

//===========================================
// Eliminar una categoria
//===========================================

app.delete('/categoria/:id', [verificaToken, verificaRole_Admin], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoria) => {

        if(err){
            req.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoria){
            res.status(400).json({
                ok: false,
                err: 'La categoria no existe'
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });

});

module.exports = app;