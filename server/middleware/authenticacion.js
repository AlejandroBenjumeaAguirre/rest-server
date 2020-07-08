const jwt = require('jsonwebtoken');


//===========================================
// Verificar token
//===========================================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

//===========================================
// Varifica role
//===========================================

let verificaRole_Admin = (req, res, next) => {

    let usuario = req.usuario;

    if ( usuario.role === 'ADMIN_ROLE' ){
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El rol del usuario no es de administrador'
            }
        });
    }
};

module.exports = {
    verificaToken,
    verificaRole_Admin
};