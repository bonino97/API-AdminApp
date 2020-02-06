var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var app = express();

//MODELOS

var Usuario = require('../models/usuario');

//ROUTES

//=====================================================================
// Login
//=====================================================================

app.post('/', (req,res) => {

    var body = req.body;


    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al Identificar Usuario. ',
                errors: err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - Email (Quitar)',
                errors: err
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'Email inexistente. - Password (Quitar)',
                errors: err
            });
        }

        usuarioDB.password = 'NULL';
        var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400});

        res.status(200).json({
            ok: true,
            mensaje: 'Login Correcto',
            token: token,
            id: usuarioDB._id
        });
    });
});


module.exports = app;