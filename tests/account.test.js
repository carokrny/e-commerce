const app = require('../app');
const request = require('supertest');
const { testLogin, userId } = require('./testData');

describe ('Account endpoints', () => {

    var token;

    beforeAll(async () => {
        const res = await request(app)
            .post('/login')
            .send(testLogin);
        token = res.body.token;
    }),

    describe('GET \'/account\'', () => {
        
        describe('Valid token', () => {

            it ('Should return user info', async () => {
                const res = await request(app)
                    .get('/account')
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.user).toBeDefined();
                expect(res.body.user.id).toEqual(userId);
                expect(res.body.user.email).toEqual(testLogin.email);
            })
        }),

        describe('Invalid token', () => {

            it ('Should return 401 error', (done) => {
                request(app)
                    .get('/account')
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

    describe('PUT \'/account/\'', () => {

        describe('Valid token', () => {

            it ('Should return user info', async () => {
                const firstName = 'Sam'
                const res = await request(app)
                    .put(`/account/`)
                    .send({ first_name: firstName })
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.user).toBeDefined();
                expect(res.body.user.id).toEqual(userId);
                expect(res.body.user.email).toEqual(testLogin.email);
                expect(res.body.user.first_name).toEqual(firstName);
            })
        }), 

        describe('Invalid token', () => {

            it ('Should return 401 error', (done) => {
                request(app)
                    .get(`/account/`)
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
});