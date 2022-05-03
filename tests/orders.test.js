const app = require('../app');
const session = require('supertest-session');
const { loginUser,
    createCSRFToken } = require('./testUtils');
const { user1 } = require('./testData').users;
const { order1 } = require('./testData').orders;

describe ('Orders endpoints', () => {

    let testSession;
    let csrfToken;

    describe('Valid auth', () => {

        beforeAll(async () => {
            try {
                // create test session
                testSession = session(app);

                // create csrf token
                csrfToken = await createCSRFToken(testSession);

                // log user in 
                await loginUser(user1, testSession, csrfToken);
            } catch(e) {
                console.log(e);
            }
        })

        describe('GET \'/account/orders/all\'', () => {
    
            it ('Should return orders info', async () => {
                const res = await testSession
                    .get('/account/orders/all')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.orders).toBeDefined();
                expect(res.body.orders.length).toBeGreaterThanOrEqual(1);
            })
        }) 

        describe('GET \'/account/orders/:order_id\'', () => {
    
            it ('Should return order info', async () => {
                const res = await testSession
                    .get(`/account/orders/${order1.id}`)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.order).toBeDefined();
                expect(res.body.orderItems).toBeDefined();
                expect(res.body.order.id).toEqual(order1.id);
            })
        })
    })

    describe('Invalid auth', () => {

        beforeAll(async () => {
            try {
                // create test session
                testSession = session(app);

                // create csrf token
                csrfToken = await createCSRFToken(testSession);    
            } catch(e) {
                console.log(e);
            }
        })

        describe('GET \'/account/orders/all\'', () => {

            it ('Should return 401 error', (done) => {
                testSession
                    .get('/account/orders/all')
                    .set('Accept', 'application/json')
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })

        describe('GET \'/account/orders/:order_id\'', () => {

            it ('Should return 401 error', (done) => {
                testSession
                    .get('/account/orders/7')
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