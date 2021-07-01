const { response, request } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const usersGet = async (req, res) => {

    const { limit = 10, from = 0 } = req.query;
    const query = { active: true }

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.json({ total, users });
}

const usersPost = async (req, res) => {

    const { name, email, password, role } = req.body
    const user = new User({ name, email, password, role });

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    res.status(201).json(user);
}

const usersPut = async (req, res) => {
    const { id } = req.params;
    const { _id, password, email, google, ...rest } = req.body;

    if (password) {
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest);
    
    res.json({user});
}

const usersDelete = async (req, res) => {

    const { id } = req.params;

    //Physical delete
    //const user = await Usuario.findByIdAndDelete(id)

    const user = await User.findByIdAndUpdate(id, { active: false })
    const userLogged = req.user
    res.json({
        user,
        userLogged
    });
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete
}