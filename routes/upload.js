const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFile, showImage, updateImageCloudinary } = require('../controllers/upload.controller');
const { allowedCollections } = require('../helpers');
const { validateFields, validateFiles } = require('../middlewares');

const router = Router();


router.post('/',validateFiles ,uploadFile);

router.put('/:collection/:id', [
    check('id', 'Id no valido').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFiles,
    validateFields
], updateImageCloudinary)


router.get('/:collection/:id',[
    check('id', 'No es un id mongo valido').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields
], showImage )

module.exports = router

