const express = require('express');
const app = express();
const mdAutenticacion = require('../middlewares/autenticacion');

//MODELOS

const Hospital = require('../models/hospital');

//ROUTES


//=====================================================================
// Obtener todos los Hospitales
//=====================================================================

app.get('/', (req, res, next) => {
    var pag = req.query.pag || 0;
    pag = Number(pag);


    Hospital.find({})
    .skip(pag)
    .limit(5)
    .populate('usuario', 'nombre email')
    .exec((err,hospitales) => {
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error cargando los Hospitales ',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            hospitales: hospitales
        });
    });
});



//=====================================================================
// Actualizar Hospitales
//=====================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req,res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id).exec((err,hospital) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el Hospital solicitado.',
                errors: err
            });
        }

        if(!hospital){
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe.',
                errors: {message: 'No existe un hospital con ese id.'}
            });
        }
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save( (err, hospitalGuardado) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }
            
            res.status(200).json({
                ok:true,
                hospital: hospitalGuardado
            });
        });
    });
});

//=====================================================================
// Crear un nuevo Hospital
//=====================================================================

app.post('/', mdAutenticacion.verificaToken, (req,res) => {
    
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario:  req.usuario._id
    });

    hospital.save( (err,hospitalGuardado) => {
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Hospital ',
                errors: err
            });
        }
        
        res.status(201).json({
            ok:true,
            hospital: hospitalGuardado
        });
    });
});


//=====================================================================
// Eliminar Hospital
//=====================================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req,res) => {
    
    id = req.params.id;

    Hospital.findByIdAndRemove(id, (err,hospitalBorrado) => {

        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al Eliminar Hospital.  ',
                errors: err
            });
        }
        
        if(!hospitalBorrado){
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un Hospital con ese id',
                errors: {message: 'No existe un Hospital con ese id'}
            });
        }

        res.status(200).json({
            ok:true,
            hospital: hospitalBorrado    
        });
    });
});


module.exports = app;