require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../lib/app');
const User = require('../lib/models/User');

describe('Auth', () => {

  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  
  afterAll(done => {
    mongoose.connection.close();
    done();
  });
  
  it('signs up a user', () => {
    return request(app)
      .post('/auth/signup')
      .send({ 
        email: 'vistitor@email.com',
        password: 'password',
        role: 'visitor',
        name:'Paula Stewart',
        bio:'born in 1988 chef paula has been cooking for 30 years...'

      })
      .then(res => {
        expect(res.body).toEqual({
          user: {
            email: 'vistitor@email.com',
            role: 'visitor',
            _id: expect.any(String),
            name:'Paula Stewart',
            bio:'born in 1988 chef paula has been cooking for 30 years...'
          },
          token: expect.any(String)
        });
      });
  });

  it('signin a user', () => {
    return User.create({ email: 'ron@yahoo.com', password: 'password12', role: 'visitor', name:'Paula Stewart',
      bio:'born in 1988 chef paula has been cooking for 30 years...' })
      .then(() => {
        return request(app)
          .post('/auth/signin')
          .send({
            email: 'ron@yahoo.com',
            password: 'password12',
            role: 'visitor',
            name:'Paula Stewart',
            bio:'born in 1988 chef paula has been cooking for 30 years...'
          })
          .then(res => {
            expect(res.body).toEqual({
              user: {
                _id: expect.any(String),
                email: 'ron@yahoo.com',
                role: 'visitor',
                name:'Paula Stewart',
                bio:'born in 1988 chef paula has been cooking for 30 years...'
              },
              token: expect.any(String)
            });      
          });
      });
  });

  it('has a verify route', () => {
    return User.create({
      email: 'test@test.com',
      password: 'password',
      role: 'visitor',
      name:'Paula Stewart',
      bio:'born in 1988 chef paula has been cooking for 30 years...'
    })
      .then(() => {
        return request(app)
          .post('/auth/signin')
          .send({ email: 'test@test.com', password: 'password', role: 'visitor', name:'Paula Stewart',
            bio:'born in 1988 chef paula has been cooking for 30 years...' })
          .then(res => res.body.token);      
      })
      .then(token => {
        return request(app)
          .get('/auth/verify')
          .set('Authorization', `Bearer ${token}`);
      })
      .then(res => {
        expect(res.body).toEqual({          
          _id: expect.any(String),
          email: 'test@test.com',
          role: 'visitor',
          name:'Paula Stewart',
          bio:'born in 1988 chef paula has been cooking for 30 years...'
        });
      });
  });
});
