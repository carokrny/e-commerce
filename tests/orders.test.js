const app = require('../app');
const request = require('supertest');
const { user } = require('./testData');

describe ('Orders endpoints', () => {

    var token;

    beforeAll(async () => {
        const res = await request(app)
            .post('/login')
            .send(user);
        token = res.body.token;
    }),

    describe('GET \'/account/orders/all\'', () => {

        describe('Valid token', () => {

            it ('Should return orders info', async () => {
                const res = await request(app)
                    .get('/account/orders/all')
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.orders).toBeDefined();
                expect(res.body.orders.length).toBeGreaterThanOrEqual(1);
            })
        }) 

        describe('Invalid token', () => {

            it ('Should return 401 error', (done) => {
                request(app)
                    .get('/account/orders/all')
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })
    }), 

    describe('GET \'/account/orders/:order_id\'', () => {

        describe('Valid token', () => {

            it ('Should return order info', async () => {
                const res = await request(app)
                    .get(`/account/orders/${user.order_id}`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.order).toBeDefined();
                expect(res.body.orderItems).toBeDefined();
                expect(res.body.order.id).toEqual(user.order_id);
            })
        }),

        describe('Invalid token', () => {

            it ('Should return 401 error', (done) => {
                request(app)
                    .get('/account/orders/7')
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })
    })
})