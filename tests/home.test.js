const app = require('../app');
const session = require('supertest-session');

describe('Home page endpoint', () => {
      
    describe('GET \'/\'', () => {

        it ('should return a home page', async () => {
            testSession = session(app);

            const res = await testSession
                .get('/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.csrfToken).toBeDefined();
        }) 
    })
})