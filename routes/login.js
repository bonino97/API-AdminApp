const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
const app = express();

//MODELOS

const Usuario = require('../models/usuario');

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
            usuario: usuarioDB
        });
    });
});


module.exports = app;