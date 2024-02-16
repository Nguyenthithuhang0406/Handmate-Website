const {Schema, default: mongoose} = require('mongoose');

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    price:{
        type: Number,
        required: true,
    },
    photos:[String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.model('products', productSchema);

module.exports = {Product};