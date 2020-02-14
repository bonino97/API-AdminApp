const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();


const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

app.use(fileUpload());

//ROUTES

app.put('/:tipo/:id', (req, res, next) => {

    var tipoColeccion = req.params.tipo;
    var id = req.params.id;

    var colecValida = ['Hospitales','Medicos','Usuarios'];

    if(colecValida.indexOf(tipoColeccion) < 0){
        return res.status(401).json({
            ok: false,
            mensaje: 'Tipo de coleccion invalida',
            errors: {message: 'Tipo de coleccion invalida'}
        });
    }

    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'Seleccione un archivo.',
            errors: {message: 'Debe seleccionar una imagen'}
        });
    }

    //Obtener nombre del archivo.
    
    var archivo = req.files.imagen;
    var arregloExtension = archivo.name.split('.');
    var extension = arregloExtension[arregloExtension.length - 1];

    //Extensiones Aceptadas
    var extensionesValidas = ['png', 'jpeg', 'jpg'];

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(401).json({
            ok: false,
            mensaje: 'Extension Invalida',
            errors: {message: 'Solo se aceptan imagenes png, jpeg, jpg.'}
        });
    }

    //Nombre de archivo personalizado

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //Mover el Archivo del Temporal a un Path especifico.

    var path = `./uploads/${tipoColeccion.toLowerCase()}/${nombreArchivo}`;

    archivo.mv(path, err =>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipoColeccion, id, nombreArchivo, res);

    });   
});


function subirPorTipo (tipo, id, nombreArchivo, res) {
    if(tipo === 'Usuarios'){

        Usuario.findById(id,'nombre img').exec((err,usuario) => {

            if(!usuario){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe.',
                    errors: {message: 'Usuario no existe.'}
                });
            }

            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al subir archivo.',
                    errors: err
                });
            }

            var pathAnterior = `../uploads/usuarios/${usuario.img}`;
            
            //Si existe, elimina la imagen anterior.
            if(usuario.img){
                if(fs.existsSync(pathAnterior)){
                    fs.unlinkSync(pathAnterior);
                }
            }

            usuario.img = nombreArchivo;
            usuario.save((err,usuarioActualizado)=>{
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada.',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if(tipo === 'Medicos'){
        Medico.findById(id,'nombre img')
                .exec((err,medico) => {




            if(!medico){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe.',
                })
            }

            const pathAnterior = `../uploads/medicos/${medico.img}`;
            
            //Si existe, elimina la imagen anterior.
            if(medico.img){
                if(fs.existsSync(pathAnterior)){
                    fs.unlinkSync(pathAnterior);
                }
            }

            medico.img = nombreArchivo;
            medico.save((err,medicoActualizado)=>{
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada.',
                    medico: medicoActualizado
                });
            });
        });
    }
    
    if(tipo === 'Hospitales'){
        Hospital.findById(id,'nombre img')
                .exec((err,hospital) => {

            if(!hospital){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe.',
                    errors: {message: 'Hospital no existe.'}
                });
            }

            const pathAnterior = `../uploads/hospitales/${hospital.img}`;

            //Si existe, elimina la imagen anterior.
            if(hospital.img){
                if(fs.existsSync(pathAnterior)){
                    fs.unlinkSync(pathAnterior);
                }
            }

            hospital.img = nombreArchivo;
            hospital.save((err,hospitalActualizado)=>{
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada.',
                    hospital: hospitalActualizado
                });
            });
        });
    }
}

module.exports = app;