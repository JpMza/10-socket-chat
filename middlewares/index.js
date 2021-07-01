const validateFields = require('../middlewares/fields-validation');
const validateJWT = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-role');
const validateFiles = require('../middlewares/validete-files');

module.exports = {
    ...validateFields,
    ...validateJWT,
    ...validateRoles,
    ...validateFiles
}