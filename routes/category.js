const { Router, response } = require('express');
const { check } = require('express-validator');
const { createCategory,
    getCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory } = require('../controllers/category.controller');
const { categoryExistById } = require('../helpers/db-validator');
const {
    validateFields,
    validateJWT,
    isAdminRole,
} = require('../middlewares')

const router = Router();

router.get('/', getCategories);

router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(categoryExistById),
    validateFields],
    getCategoryById);

router.post('/', [
    validateJWT,
    check('name', 'El nombre es requerido').notEmpty(),
    validateFields],
    createCategory);

router.put('/:id', [
    validateJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(categoryExistById),
    validateFields],
    updateCategory);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(categoryExistById),
    validateFields],
    deleteCategory);



module.exports = router;