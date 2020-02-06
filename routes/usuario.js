var express = require('express');
var bcrypt = require('bcryptjs');
var app = express();
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');

//MODELOS

var Usuario = require('../models/usuario');

//ROUTES


//=====================================================================
// Obtener todos los Usuarios
//=====================================================================

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role').exec((err,usuarios) => {
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error cargando Usuario: ',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuarios
        });
    });
});



//=====================================================================
// Actualizar Usuario
//=====================================================================

app.put('/:id', (req,res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, 'nombre email img').exec((err,usuario) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el Usuario solicitado.',
                errors: err
            });
        }

        if(!usuario){
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe.',
                errors: {message: 'No existe un usuario con ese id.'}
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;

        usuario.save( (err, usuarioGuardado) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            
            res.status(200).json({
                ok:true,
                usuario: usuarioGuardado,
                usuarioToken: req.usuario
            });
        });
    });
});

//=====================================================================
// Crear un nuevo Usuario
//=====================================================================

app.post('/', mdAutenticacion.verificaToken, (req,res) => {
    
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        img: body.img,
        role: body.role
    });

    usuario.save( (err, usuarioGuardado) => {
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Usuario:  ',
                errors: err
            });
        }
        
        res.status(201).json({
            ok:true,
            usuario: usuarioGuardado
        });
    });
});


//=====================================================================
// Eliminar Usuario
//=====================================================================

app.delete('/:id', (req,res) => {
    
    id = req.params.id;

    Usuario.findByIdAndRemove(id, (err,usuarioBorrado) => {

        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al Eliminar Usuario.  ',
                errors: err
            });
        }
        
        if(!usuarioBorrado){
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: {message: 'No existe un usuario con ese id'}
            });
        }

        res.status(200).json({
            ok:true,
            usuario: usuarioBorrado    
        });
    });
});


module.exports = app;