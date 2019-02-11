//=====
// Verificar token
//====
const jwt = require('jsonwebtoken');

let verificarToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario = decoded.usuario;
        next();
    });
}

/*===========
 Verifica AdminRole
==========*/
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    if (!(usuario.role === 'ADMIN_ROLE')) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Su usuario no es el de un administrador'
            }
        });
    }
    next();
}

module.exports = {
    verificarToken,
    verificaAdmin_Role
}