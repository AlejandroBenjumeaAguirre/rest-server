const express = require('express');

const { verificaToken, verificaRole_Admin } = require('../middleware/authenticacion');

const app = express();

const Producto = require('../models/producto');


//===========================================
// Busqueda por termino
//===========================================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
            .populate('categoria', 'nombre')
            .exec( (err, productosDB) => {

                if(err){
                    res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if(!productosDB){
                    res.status(400).json({
                        ok: false,
                        error: 'No existe un producto con ese termino de busqueda'
                    });
                }

                res.json({
                    ok: true,
                    producto: productosDB
                });
            });
});

//===========================================
// Producto por ID
//===========================================

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            res.status(400).json({
                ok: false,
                error: 'El producto no existe'
            });
        }

        res.json({
            ok:true,
            producto: productoDB
        });
    });
});

//===========================================
// Consultar los productos
//===========================================

app.get('/producto', verificaToken, (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponibilidad: true })
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre')
            .exec( (err, productos) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                Producto.countDocuments({ disponibilidad: true }, (err, conteo) => {
                    if(err){
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        productos,
                        conteo
                    });
                });
            });

});

//===========================================
// Crear productos
//===========================================

app.post('/producto', [verificaToken, verificaRole_Admin], (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save( (err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err: 'No se puede crear'
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                error: 'El producto no se pudo crear'
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//===========================================
// Actualizar productos
//===========================================

app.put('/producto/:id', [verificaToken, verificaRole_Admin], (req, res) => {

    let body = req.body;
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, body, {new:true, context: 'query'}, (err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                producto: productoDB
            });
        }

        if(!productoDB){
            return req.status(400).json({
                ok: false,
                error: 'El producto no existe'
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//===========================================
// Eliminar un producto
//===========================================

app.delete('/producto/:id', [verificaToken, verificaRole_Admin], (req, res) => {

    let id = req.params.id;

    let cambioEstado = {
        disponibilidad: false
    };

    Producto.findByIdAndUpdate(id, cambioEstado, {new: true, context: 'query'}, (err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                error: 'El producto no existe'
            });
        }

        if(productoDB.disponibilidad === false){
            return res.status(401).json({
                ok: false,
                error: 'El producto ya se encuentra inactivo',
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
        
        

    });
});

module.exports = app;