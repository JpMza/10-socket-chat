const { response, request } = require('express');
const { Product } = require('../models');

const getProducts = async (req, res = response) => {

    const { limit = 10, from = 0 } = req.query;
    let query = { active: true }
    const [products, total] = await Promise.all([
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(from))
            .limit(Number(limit)),
        Product.countDocuments(query)]
    )

    return res.status(200).json({ products, total })

}

const getProductById = async (req, res = response) => {

    let { id } = req.params;

    const productDb = await Product.findById(id)
        .populate('category', 'name')
        .populate('user', 'name');
    return res.status(200).json(productDb)
}

const createProduct = async (req = request, res = response) => {

    const { active, ...productData } = req.body
    const data = {
        ...productData,
        name: productData.name.toUpperCase(),
        user: req.user._id,
    };

    const product = new Product(data);
    await product.save();

    res.status(200).json(product);
}

const updateProduct = async (req = request, res = response) => {
    let { id } = req.params;

    let { active, avaliable = true, ...productData } = req.body;
    let user = req.user._id;
    let data = {
        ...productData,
        name: productData.name.toUpperCase(),
        avaliable,
        user
    }

    const productUpdated = await Product.findByIdAndUpdate(id, data)
        .populate('user', 'name')
        .populate('category', 'name');

    res.status(200).json(productUpdated);
}

const uptadteProductToAvaliable = async (req, res = response) => {

    let { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { avaliable: true });

    res.status(200).json({ product })

}

const deleteProduct = async (req, res = response) => {
    let { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { active: false });

    res.status(200).json({ product });
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uptadteProductToAvaliable
}