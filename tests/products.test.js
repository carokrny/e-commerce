const app = require('../app');
const request = require('supertest');
const { product } = require('./testData');

describe ('Product endpoints', () => {

    describe('GET \'/products\'', () => {

        it ('should return products page', async () => {
            const res = await request(app)
                .get('/products')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toBeDefined();
            expect(res.body.products).toBeDefined();
        })
    }), 

    describe('GET \'/products/search?q=cotton\'', () => {

        it ('should return products by category', async () => {
            const query = 'cotton';
            const res = await request(app)
                .get(`/products/search?q=${query}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toBeDefined();
            expect(res.body.products).toBeDefined();
            expect(res.body.products[0]).toBeDefined();
            expect(res.body.products[0].description).toBeDefined();
            expect(res.body.products[0].description).toContain(query);
        })
    }),

    describe('GET \'/products/:product_id\'', () => {

        it ('should return a product by id', async () => {
            const res = await request(app)
                .get(`/products/${product.product_id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toBeDefined();
            expect(res.body.product).toBeDefined();
            expect(res.body.product.id).toEqual(product.product_id);
        })
    }), 

    describe('GET \'/products/category/:category\'', () => {

        it ('should return products by category', async () => {
            const category = 'tops';
            const res = await request(app)
                .get(`/products/category/${category}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toBeDefined();
            expect(res.body.products).toBeDefined();
            expect(res.body.products[0].category).toEqual(category);
        })
    })
});