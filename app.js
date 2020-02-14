// REQUIRES

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//INICIALIZAR VARIABLES

var app = express();

//CORS

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // DOMINIO PERMITIDO PARA INTERACTUAR CON EL SVR
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
  });



// PARSE application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//IMPORTAR RUTAS

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenRoutes = require('./routes/imagen');


// CONECTAR A BASE DE DATOS

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err,res) => {
    if(err) throw err;
    
    console.log('Base de Datos Online ~ Puerto: 27017');
});

// ESCUCHAR PETICIONES

app.listen(3000, () =>{
    console.log('Express Server Online ~ Puerto: 3000')
});

//SERVER INDEX CONFIG

var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));

//RUTAS

app.use('/Usuario', usuarioRoutes);
app.use('/Login', loginRoutes);
app.use('/Hospital', hospitalRoutes);
app.use('/Medico', medicoRoutes);
app.use('/Busqueda', busquedaRoutes);
app.use('/Upload', uploadRoutes);
app.use('/Img', imagenRoutes);

app.use('/', appRoutes);
