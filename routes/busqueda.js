const express = require('express');
const app = express();
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

//ROUTES


//=====================================================================
// Busqueda por Coleccion
//=====================================================================

app.get('/Coleccion/:tabla/:busqueda', (req,res,next) => {
    var busqueda = req.params.busqeda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch(tabla){
        case 'Usuarios':
            promesa = buscarUsuarios(busqueda,regex);
        break;
        case 'Medicos':
            promesa = buscarMedicos(busqueda,regex);
        break;
        case 'Hospitales':  
            promesa = buscarHospitales(busqueda,regex);
        break;
        default:         
            return res.status(400).json({
                ok:false,
                mensaje: 'Tipo de busqueda incorrecta, no se encuentra la coleccion indicada',
                error: {message: 'Coleccion invalida'}
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok:true,
            tabla: data
        });
    });
});



//=====================================================================
// Busqueda Global
//=====================================================================

app.get('/Todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda,regex),
        buscarUsuarios(busqueda, regex)
    ])
    .then(respuesta => {
        res.status(200).json({
            ok:true,
            hospitales: respuesta[0],
            medicos: respuesta[1],
            usuarios: respuesta[2]
        });
    })
});


function buscarHospitales(busqueda,regex){

    return new Promise((resolve,reject) => {
        Hospital.find({nombre: regex}, (err, hospitales) => {
            
            if(err){
                reject('Error al cargar Hospitales.');
            } else {
                resolve(hospitales);
            }   
        });
    })
}

function buscarMedicos(busqueda,regex){

    return new Promise((resolve,reject) => {
        Medico.find({nombre: regex}, (err, medicos) => {
            
            if(err){
                reject('Error al cargar Medicos.');
            } else {
                resolve(medicos);
            }   
        });
    })
}


function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}





module.exports = app;