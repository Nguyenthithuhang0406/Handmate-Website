const {Product} = require('../../models/product');
const {Boom} = require('boom');
const {ProductSchema} = require('./validation');

//tao san pham
const Create = async(req, res, next) => {
    const input = req.body; //lay du lieu
    const {error} = ProductSchema.validate(input);

    if(error){
        return next(Boom.badRequest(error.details[0].message));
    }

    try{
        input.photos = JSON.parse(input.photos);

        //tao moi mot san pham
        const product = new Product(input);
        const savedData = await product.save(); //luu vao co so du lieu

        //tra du lieu ve phia client
        res.json(savedData);
    }catch(e){
        next(e);
    }
};

//lay thong tin san pham
const Get = async(req, res, next) => {
    const {product_id} = req.params;  //lay thong tin cua mot san pham

    if(!product_id){
        return next(Boom.badRequest("missing paramter (:product_id)"));
    }

    try{
        const product = await Product.findById(product_id);//tim kiem thong tin san pham

        //tra ve cho client
        res.json(product);
    }catch(e){
        next(e);
    }
};


//cap nhat thong tin san pham
const Update = async (req, res, next) => {
    const {product_id} = req.params;

    try{
        const updated = await Product.findByIdAndUpdate(product_id, req.body, {
            new: true,
        });

        res.json(updated);
    }catch(e){
        next(e);
    }
};

const Delete = async (req, res, next) => {
    const {product_id} = req.params;

    try{
        const deleted = await Product.findByIdAndDelete(product_id);

        if(!deleted){
            throw Boom.badRequest("Product not found");
        }

        res.json(deleted);
    }catch(e){
        next(e);
    }
};

const limit = 12;
const GetList = async (req, res, next) => {
    let {page} = req.query;

    if(page < 1){
        page = 1;
    }

    const skip = (parseInt(page) - 1) * limit;

    try{
        const products = await Product.find({})
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit);

        res.json(products);
    } catch(e){
        next(e);
    }
};

module.exports = {Create, Get, Update, Delete, GetList };