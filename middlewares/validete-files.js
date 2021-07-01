const { response } = require("express")

const validateFiles = (req, res = response, next) => {


    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        res.status(400).json({
            msg: 'No hay archivos para subir - validar archivos'
        })
    }

    next();
}


module.exports = {
    validateFiles
}