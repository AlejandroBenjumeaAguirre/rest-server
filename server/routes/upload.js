const express = require('express');

const fileUpload = require('express-fileupload');

const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');


app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:tipo/:id', (req, res) => {

    let id = req.params.id;
    let tipo = req.params.tipo;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            error: 'No se ha cargado nigun archivo'
        });
      }

      let tiposValidos = ['productos', 'usuarios'];

      if(tiposValidos.indexOf(tipo) < 0){
          return res.status(400).json({
             ok: false,
             error: 'El tipo no es valido, tipos validos ' + tiposValidos.join(', ')
          });
      }

      let archivo = req.files.archivo;

      let nombreCortado = archivo.name.split('.');
      let extencion = nombreCortado[nombreCortado.length -1];

      //Extenciones permitidas
      let extencionesValidas = ['jpg', 'png', 'jpeg', 'gif'];

      if(extencionesValidas.indexOf(extencion) < 0){
          return res.status(400).json({
                ok: false,
                error: 'Extencion del archivo no valida, extenciones permitidas' + extencionesValidas.join(', ')
          });
      }

      // Cambiar el nombre del archivo
      let nombreArchivo = `${id}-${Math.floor(Math.random() * (100000 - 0)) + 0}.${extencion}`;


      archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err)
          return res.status(500).json({
              ok: false,
              err
          });
    
        // Imagen cargada
        if(tipo === 'usuarios'){
            imagenUsuario(id, res, nombreArchivo);
            return;
        }
        if(tipo === 'productos'){
            imagenProducto(id, res, nombreArchivo);
            return;
        }
      });


});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById( id, (err, usuarioDB) => {

        if(err){
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if(!usuarioDB){
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                error: 'El usuario no existe'
            });
        }

        /* let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);

        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        } */

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
    
        usuarioDB.save( (err, usuarioActualizado) => {
    
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            res.json({
                ok: true,
                usuario: usuarioActualizado
            });
        });
    

    });  
}

function imagenProducto(id, res, nombreArchivo){

    Producto.findById( id, (err, productoDB) => {

        if(err){
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                error: 'El producto no existe'
            });
        }

       /*  let pathImagen = path.resolve(__dirname, `../../uploads/productos/${productoDB.img}`);

        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        } */

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save( (err, productoActualizado) => {

            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoActualizado
            });

        });
    });
}

function borrarArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
}


module.exports = app;