const { Role,
    Product,
    Category,
    User } = require('../models');

const isValidRole = async (role = '') => {

    const roleExist = await Role.findOne({ role });
    if (!roleExist) {
        throw new Error(`El rol ${role} no está registrado en la base de datos`);
    }
}

const isEmailRepeated = async (email = '') => {

    const mailExist = await User.findOne({ email });
    if (mailExist) {
        throw new Error(`El correo: ${email} ya está registrado`)
    }

}

const userExistById = async (id) => {

    const userExist = await User.findById(id);
    if (!userExist) {
        throw new Error(`El usuario con el id: ${id} no existe`)
    }

}

const categoryExistById = async (id) => {

    if (!id) {
        throw new Error('La categoria es requerida');
    }

    const categoryExist = await Category.findById(id);
    if (!categoryExist) {
        throw new Error(`No existe la categoria con id ${id}`)
    } else if (categoryExist && !categoryExist.active) {
        throw new Error(`La categoria ${categoryExist.name} existe pero no está activa`)
    }
}

const productExistByName = async (name) => {

    const productInDb = await Product.findOne({ name });

    if (productInDb) {
        throw new Error(`El producto ${productInDb.name} ya existe`)
    }
}

const productExistById = async (id) => {

    const productInDb = await Product.findOne({ id });

    if (productInDb) {
        throw new Error(`El producto ${productInDb.name} ya existe`)
    }
}

const productAlreadyDeleted = async (id) => {

    const productInDb = await Product.findById(id);

    if (!productInDb) {
        throw new Error(`No se encontró el producto ${id} `)
    } else if (!productInDb.active) {
        throw new Error(`El producto id: ${id} ya se encuentra inactivo`)
    }
}

const allowedCollections = (collection = '', allowedCollections = []) => {

    const isIncluded = allowedCollections.includes(collection);
    if (!isIncluded) {
        throw new Error(`La colección ${collection} no es permitida, ${allowedCollections}`)
    }
    return true;
}

module.exports = {
    isValidRole,
    isEmailRepeated,
    userExistById,
    categoryExistById,
    productExistByName,
    productExistById,
    productAlreadyDeleted,
    allowedCollections
}