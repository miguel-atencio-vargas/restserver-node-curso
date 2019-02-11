const express = require('express');
const app = express();
const Categoria = require('../models/categoria');
const _ = require('underscore');
let {
    verificarToken,
    verificaAdmin_Role
} = require('../middlewares/authentication');


// crear categoria
app.post('/categoria', verificarToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        name: body.name,
        description: body.description,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        let status = 500;
        if (err || !categoriaDB) {
            if (!categoriaDB) status = 400;
            return res.status(status).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoriaDB,
            message: `Categoria '${body.name}' creada correctamente`
        });
    });
});
// Mostrar todas las categorias
app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find({
            state: true
        })
        .sort('description')
        .populate('usuario', 'name email')
        .exec((err, categorias) => {
            Categoria.countDocuments({ state: true }, (err, cantidad) => {
                res.json({
                    ok: true,
                    categorias,
                    cantidad
                });
            });
        });
});

// Mostrar una categoria por ID
app.get('/categoria-id/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err || categoriaDB === null) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Actualizar descripcion de la categoria
app.put('/categoria/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['description']);
    Categoria.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoriaActulizada: categoriaDB
        });
    });
});

// Borra la categoria de la DB (modo incorrecto)
app.delete('/categoria/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err || !categoriaDB) {
            if (!err) err = 'Categoria no encontrada';
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoriaBorrada: categoriaDB
        });
    });
});

module.exports = app;