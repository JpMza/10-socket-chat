const { Router } = require('express');
const { check } = require('express-validator');
const { usersGet, usersPost, usersPut, usersDelete } = require('../controllers/user.controller');
const { isValidRole, isEmailRepeated, userExistById } = require('../helpers/db-validator');
const {
    validateFields,
    isAdminRole,
    validateJWT,
    hasRole
} = require('../middlewares')

const router = Router();

router.get('/', usersGet);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatorio y debe ser de mas de 6 caracteres').isLength({ min: 6 }),
    //check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom(isEmailRepeated),
    check('role').custom(isValidRole),
    validateFields
], usersPost)

router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(userExistById),
    check('role').custom(isValidRole),
    validateFields,
], usersPut)

router.delete('/:id', [
    validateJWT,
    //isAdminRole,
    hasRole('ROLE_ADMIN', 'ROLE_SELL'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(userExistById),
    validateFields
], usersDelete)


module.exports = router;