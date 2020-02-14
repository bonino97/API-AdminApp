const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const mdAutenticacion = require('../middlewares/autenticacion');

//MODELOS

const Usuario = require('../models/usuario');

//ROUTES


//=====================================================================
// Obtener todos los Usuarios
//=====================================================================

app.get('/', (req, res, next) => {

    var pag = req.query.pag || 0;
    pag = Number(pag);

    Usuario.find({}, 'nombre img email')
    .skip(pag)
    .limit(5)
    .exec((err,usuarios) => {
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error cargando Usuario: ',
                errors: err
            });
        }

        Usuario.count({}, (err, cont) => {
            res.status(200).json({
                ok: true,
                usuarios
            });
        });
    });
});



//=====================================================================
// Actualizar Usuario
//=====================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req,res) => {

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

app.post('/', (req,res) => {
    
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