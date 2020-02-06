// REQUIRES

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//INICIALIZAR VARIABLES

var app = express();

// PARSE application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//IMPORTAR RUTAS

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

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

app.use('/Usuario', usuarioRoutes);
app.use('/Login', loginRoutes);
app.use('/', appRoutes);
