const httpError = require('http-errors');
const ProductModel = require('../models/ProductModel');
const Product = new ProductModel();


module.exports.getAll = async () => {
    try {
        const products = await Product.getAll();

        // throw error if no products found 
        if(!products) {
            throw httpError(404, 'Products not in category.');
        }

        return { products };
        
    } catch(err) {
        throw err;
    }
} 

module.exports.getById = async (id) => {
    try {
        const product = await Product.findById(id);

        // throw error if no product found
        if(!product) {
            throw httpError(404, 'Product not found');
        }

        return { product };

    } catch(err) {
        throw err;
    }
} 

module.exports.getCategory = async (category) => {
    try {
        const products = await Product.findByCategory(category);

        if(!products) {
            throw httpError(404, 'Products not in category.');
        }

        return { products };

    } catch(err) {
        throw err;
    }    
} 