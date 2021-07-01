const { response } = require("express");
const { User, Category, Product } = require("../models");
const { ObjectId } = require('mongoose').Types;

const allowedCollections = [
    'users',
    'categories',
    'products'
]

const checkIsMongoId = term => ObjectId.isValid(term);

const searchUsers = async (term = '', res = response) => {

    const isMongoId = checkIsMongoId(term);
    if (isMongoId) {
        const user = await User.findById(term);

        return res.status(200).json({
            result: (user) ? [user] : []
        })
    }

    const regex = new RegExp(term, 'i');

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ active: true }]
    });

    res.status(200).json({
        result: users
    })

}

const searchProducts = async (term, res = response) => {

    const isMongoId = checkIsMongoId(term);
    const isCategory = await Category.findById(term) ? true : false;
    if (isMongoId && !isCategory) {
        const product = await Product.findById(term).populate('category', 'name');

        return res.status(200).json({
            result: (product) ? [product] : []
        })
    }

    const isNumber = new RegExp(/^\d+$/).test(term);
    const regex = (isNumber) ? Number(term) : new RegExp(term, 'i');
    const products = await Product.find({
        $or: [{ name: regex }, { description: regex }, { price: isNumber ? regex : null }, { category: isCategory ? ObjectId(term) : null }],
        $and: [{ active: true }, { avaliable: true }]
    }).populate('category', 'name');;

    res.status(200).json({
        result: products
    })

}

const searchCategories = async (term = '', res) => {

    const isMongoId = checkIsMongoId(term);
    if (isMongoId) {
        const category = Category.findById(term);

        return res.status(200).json({
            result: [category]
        })
    }

    const regex = new RegExp(term, 'i');

    const categories = await Category.find({ name: regex, active: true });

    res.status(200).json({
        result: [categories]
    })

}

const search = (req, res = response) => {

    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection)) {
        res.status(400).json({ msg: `Las colecciones permitidas son: ${allowedCollections}` })
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break

        case 'categories':
            searchCategories(term, res);
            break;

        default:
            break;
    }


}

module.exports = {
    search
}