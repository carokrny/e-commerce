const app = require('../app');
const session = require('supertest-session');
describe('Home Page endpoint', () => {
      
    describe('GET \'/\'', () => {

        it ('should return a home page', (done) => {
            session(app)
              .get('/')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(200, done);
        }) 
    })
})