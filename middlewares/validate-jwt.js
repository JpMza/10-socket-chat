const { response } = require('express')
const jwt = require('jsonwebtoken');
const User = require('../models/user')

const validateJWT = async (req, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay un token en la petición'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_KEY)
        req.uid = uid;

        const userLogged = await User.findById(uid)

        if (!userLogged) {
            return res.status(401).json({
                msg: 'Token invalido - El usuario no existe'
            })
        }
        //verificar usuario activo
        if (!userLogged.active) {
            return res.status(401).json({
                msg: 'Token invalido - Usuario inactivo'
            })
        }

        req.user = userLogged

        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token invalido'
        })
    }

}

module.exports = {
    validateJWT
}

