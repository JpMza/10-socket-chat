const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        unique: true
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String
    },
    avaliable: {
        type: Boolean,
        default: true
    },
    img:{ 
        type: String
    }

})

ProductSchema.methods.toJSON = function () {
    const { __v, _id, active, ...prod } = this.toObject();
    prod.pid = _id;
    return prod;
}

module.exports = model('Product', ProductSchema);