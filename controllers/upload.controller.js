const { response } = require('express');
const { uploadFileHelper } = require('../helpers');
const { User, Product } = require('../models');
const path = require('path');
const fs = require('fs');
var cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const uploadFile = async (req, res = response) => {

    try {
        //const fileName = await uploadFileHelper(req.files, ['txt', 'md'],'text');
        const fileName = await uploadFileHelper(req.files, undefined, 'img')

        res.json({ msg: `El archivo se subió correctamente: ${fileName}` })
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Ocurrio un error al subir el archivo' })
    }
}

const updateImage = async (req, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({ msg: `No existe usuario con el id : ${id}` })
            }

            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({ msg: `No existe producto con el id : ${id}` })
            }

            break;

        default:
            return res.status(400).json({ msg: 'Ocurrio un error' })
    }

    try {
        if (model.img) {
            const imagePath = path.join(__dirname, '../uploads', collection, model.img);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Ocurrió un error al eliminar imagen previa'
        })
    }

    const fileName = await uploadFileHelper(req.files, undefined, collection)

    model.img = fileName

    await model.save()

    res.json({ model });
}


const updateImageCloudinary = async (req, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({ msg: `No existe usuario con el id : ${id}` })
            }

            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({ msg: `No existe producto con el id : ${id}` })
            }

            break;

        default:
            return res.status(400).json({ msg: 'Ocurrio un error' })
    }

    if (model.img) {
        const arrName = model.img.split('/');
        const name = arrName[arrName.length - 1];
        const [public_id] = name.split('.');
        await cloudinary.uploader.destroy(public_id);
    }


    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    model.img = secure_url;

    await model.save()

    res.json({ model });
}

const showImage = async (req, res = response) => {

    const { id, collection } = req.params;

    let model;
    const noImagePath = path.join(__dirname, '../assets/no-image.jpg');
    const noImagePathExists = fs.existsSync(noImagePath);

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model && noImagePathExists) {
                return res.sendFile(noImagePath);
            }

            break;
        case 'products':
            model = await Product.findById(id);
            if (!model && noImagePathExists) {
                return res.sendFile(noImagePath);
            }

            break;

        default:
            return res.status(400).json({ msg: 'No se encontró imagen' })
    }

    try {
        if (model.img) {
            const imagePath = path.join(__dirname, '../uploads', collection, model.img);
            if (fs.existsSync(imagePath)) {
                return res.sendFile(imagePath);
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Ocurrió un error al eliminar imagen previa'
        })
    }

    if (noImagePathExists) {
        return res.sendFile(noImagePath);
    }

    res.json({ msg: 'Nada encontrado' });
}

module.exports = {
    uploadFile,
    updateImage,
    showImage,
    updateImageCloudinary
}