const { response } = require('express');

const isAdminRole = (req, res = response, next) => {

    const user = req.user;
    if (!user) {
        return res.status(401).json({
            msg: 'Se intenta verificar usuario antes del token'
        })
    }

    const { role, name } = user;

    if (role !== 'ROLE_ADMIN') {
        return res.status(500).json({
            msg: `${name} no tiene permisos para modificar el registro`
        })
    }

    next();
}


const hasRole = (...roles) => {

    return (req, res = response, next) => {
        if (!req.user) {
            return res.status(401).json({
                msg: 'Se intenta verificar usuario antes del token'
            })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `El recurso solicitado requiere uno de los siguientes roles ${roles}`
            })
        }

        next()
    }

}

module.exports = {
    isAdminRole,
    hasRole
}