const app = require('../app');
const request = require('supertest');

describe('Home Page endpoint', () => {
      
    describe('GET \'/\'', () => {

        it ('should return a home page', (done) => {
          request(app)
              .get('/')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(200, done);
        }) 
    })
});