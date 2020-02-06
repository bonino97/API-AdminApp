var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');

//MODELOS

var Medico = require('../models/medico');

//ROUTES


//=====================================================================
// Obtener todos los Medicos
//=====================================================================

app.get('/', (req, res, next) => {

    Medico.find({}).exec((err,medicos) => {
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error cargando los Medicos ',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            medicos: medicos
        });
    });
});


//=====================================================================
// Crear un nuevo Medico
//=====================================================================

app.post('/', mdAutenticacion.verificaToken, (req,res) => {
    
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        usuario:  req.usuario._id,
        hospital: body.hospital,
        img: body.img
    });

    medico.save( (err,medicoGuardado) => {
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Medico ',
                errors: err
            });
        }
        
        res.status(201).json({
            ok:true,
            medico: medicoGuardado
        });
    });
});



//=====================================================================
// Actualizar Medicoes
//=====================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req,res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id).exec((err,medico) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el Medico solicitado.',
                errors: err
            });
        }

        if(!medico){
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe.',
                errors: {message: 'No existe un medico con ese id.'}
            });
        }
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save( (err, medicoGuardado) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }
            
            res.status(200).json({
                ok:true,
                medico: medicoGuardado
            });
        });
    });
});

//=====================================================================
// Eliminar Medico
//=====================================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req,res) => {
    
    id = req.params.id;

    Medico.findByIdAndRemove(id, (err,medicoBorrado) => {

        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al Eliminar Medico.  ',
                errors: err
            });
        }
        
        if(!medicoBorrado){
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un Medico con ese id',
                errors: {message: 'No existe un Medico con ese id'}
            });
        }

        res.status(200).json({
            ok:true,
            medico: medicoBorrado    
        });
    });
});


module.exports = app;