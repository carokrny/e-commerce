const httpError = require('http-errors');
const ProductModel = require('../models/ProductModel');
const Product = new ProductModel();


module.exports.getAll = async () => {
    try {
        return await Product.getAll();
    } catch(err) {
        throw new Error(err);
    }
} 

module.exports.getById = async (id) => {
    try {
        const prod = await Product.findById(id);

        if(!prod) {
            throw httpError(404, 'Product not found');
        }

        return prod;
    } catch(err) {
        throw new Error(err);
    }
} 

module.exports.getCategory = async (category) => {
    try {
        const prods = await Product.findByCategory(category);

        if(!prods) {
            throw httpError(404, 'Products not in category.');
        }

        return prods;
    } catch(err) {
        throw new Error(err);
    }    
} 