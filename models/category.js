const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name: {
        type: String,
        required : [true, 'El nombre es requerido'],
        unique: true
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

})

CategorySchema.methods.toJSON = function () {
    const { __v, _id, active,...cat } = this.toObject();
    cat.cid = _id;
    return cat;
}

module.exports = model('Category', CategorySchema);