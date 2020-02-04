// REQUIRES

var express = require('express');
var mongoose = require('mongoose');



//INICIALIZAR VARIABLES

var app = express();

// CONECTAR A BASE DE DATOS

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err,res) => {
    if(err) throw err;
    
    console.log('Base de Datos Online ~ Puerto: 27017');
});

// ESCUCHAR PETICIONES

app.listen(3000, () =>{
    console.log('Express Server Online ~ Puerto: 3000')
});


//RUTAS

app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});