const { Router, response } = require('express');
const { check } = require('express-validator');
const { createProduct, getProductById, getProducts, updateProduct, deleteProduct, uptadteProductToAvaliable } = require('../controllers/product.controller');
const { productExistByName, productExistById, productAlreadyDeleted, categoryExistById } = require('../helpers/db-validator');
const {
    validateFields,
    validateJWT,
    isAdminRole,
} = require('../middlewares')

const router = Router();

router.get('/', getProducts);

router.get('/:id', [
    validateJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(productExistByName),
    validateFields],
    getProductById);

router.post('/', [
    validateJWT,
    check('name').custom(productExistByName),
    check('name', 'El nombre es requerido').notEmpty(),
    check('category').custom(categoryExistById),
    validateFields],
    createProduct);

router.put('/:id', [
    validateJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(productExistByName),
    validateFields],
    updateProduct);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(productExistById),
    check('id').custom(productAlreadyDeleted),
    validateFields],
    deleteProduct);

router.put('/avaliable/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(productExistById),
    validateFields
], uptadteProductToAvaliable)

module.exports = router;