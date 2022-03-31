const httpError = require('http-errors');
const Product = require('../models/ProductModel');


module.exports.getAll = async () => {
    try {
        const products = await Product.getAll();

        // throw error if no products found 
        if(!products) {
            throw httpError(404, 'No products.');
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
            throw httpError(404, 'Product not found.');
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
            throw httpError(404, 'No products in category.');
        }

        return { products };

    } catch(err) {
        throw err;
    }    
} 

module.exports.getSearch = async (query) => { 
    try {
        // return error if no queries
        if (!query) {
            throw httpError(400, 'Please enter search query.');
        }

        // get all products
        var products = [];
        
        // remove products that do not match query 
        for (var [key, value] of Object.entries(query)) {
            value = value.toLowerCase();
            const queryResults = await Product.findByQuery(value);
            if (queryResults) {
                products = [...products, ...queryResults];
            }
        }

        // return error if no products match query
        if(products.length === 0) {
            throw httpError(404, 'No results. Please try another search.');
        }

        return { products };

    } catch(err) {
        throw err;
    }    
} 