const express = require('express');
const app = express();
const {
    verificarToken,
    verificaAdmin_Role
} = require('../middlewares/authentication');
const _ = require('underscore');
let Producto = require('../models/producto');

// Crea un nuevo producto
app.post('/producto', verificarToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        let status = 500;
        if (err || !productoDB) {
            if (!productoDB) status = 400;
            return res.status(status).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productoDB,
            message: `Producto '${body.nombre}' creada correctamente`
        });
    });
});

// Muestra de forma paginada y populada los productos
app.get('/producto', verificarToken, (req, res) => {
    let desde = req.query.desde || 0;
    let cantidad = req.query.cantidad || 5;
    desde = Number(desde);
    cantidad = Number(cantidad);
    Producto.find({
            state: true
        })
        .skip(desde)
        .limit(cantidad)
        .populate('usuario', 'name email')
        .populate('categoria', 'name description')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments({
                state: true
            }, (err, cantidad) => {
                res.json({
                    ok: true,
                    productosDB,
                    cantidad
                });
            });
        });
});
// Obtener por ID un producto
app.get('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, { state: true })
        .populate('usuario', 'name email')
        .populate('categoria', 'name description')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                productoDB
            });
        });
});
// Actulizar un producto
app.put('/producto/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'state']);
    Producto.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            message: 'Producto correctamente actualizado',
            productoDB
        });
    });
});
// Borrar un producto
app.delete('/producto/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {
        state: false
    }, {
        new: true,
        runValidators: true
    }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            message: 'Producto eliminado correctamente',
            productoDB
        });
    });
});

//Buscar productos
app.get('/producto/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;
    // para crear una busqueda flexible debemos crearnos una expresion regular
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});
module.exports = app;