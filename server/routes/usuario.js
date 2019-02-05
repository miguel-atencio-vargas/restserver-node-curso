const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');
const { verificarToken, verificaAdmin_Role } = require('../middlewares/authentication')

// Crear usuario POST
app.post('/usuario', [verificarToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
// actualizar usuario
app.put('/usuario/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);
    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

// obtener usuarios de forma paginada
app.get('/usuarios', verificarToken, (req, res) => {
    let desde = req.query.desde || 0;
    let cantidad = req.query.cantidad || 5;
    desde = Number(desde);
    cantidad = Number(cantidad);
    Usuario.find({ state: true }, 'name email role google')
        .skip(desde)
        .limit(cantidad)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ state: true }, (err, cantidad) => {
                res.json({
                    ok: true,
                    usuarios,
                    cantidad
                })
            })
        })
});

app.delete('/usuario/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err || !usuarioBorrado) {
            if (!err) {
                err = 'Usuario no encontrado';
            }
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuarioBorrado
        });
    });
});

app.put('/borrar-user/:id', (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { state: false }, { new: true }, (err, userUpdate) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            userUpdate
        });
    })
})

module.exports = app;