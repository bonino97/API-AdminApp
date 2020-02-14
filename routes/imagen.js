const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();


//ROUTES

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req. params.img;
    var pathImagen = path.resolve(__dirname,`../uploads/${tipo}/${img}`);
    var colecValida = ['Hospitales','Medicos','Usuarios'];

    if(colecValida.indexOf(tipo) < 0){
        return res.status(401).json({
            ok: false,
            mensaje: 'Tipo de coleccion invalida',
            errors: {message: 'Tipo de coleccion invalida'}
        });
    }


    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname,`../assets/no-img.jpg`);
        res.sendFile(pathNoImage);
    }
});

module.exports = app;