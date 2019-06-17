/* eslint-disable no-console */
require('dotenv').config();
require('../../lib/utils/connect')();
const User = require('../../lib/models/User');
const mongoose = require('mongoose');
const { Types } = require('mongoose');

describe('User models', () => {

  beforeEach(done => {
    mongoose.connection.dropDatabase(done);
  });
  
  afterAll(done => {
    mongoose.connection.close(done);
  });

  it('validates a good model', () => {
    return User.create({
      email: 'chef@gmail.com',
      password: 'abc123',
      role: 'chef',
      bio:'born in 1988 chef paula has been cooking for 30 years...'

    })
      .then(user => {
        expect(user.toJSON()).toEqual({
          _id: expect.any(Types.ObjectId),
          email: 'chef@gmail.com',
          role: 'chef',
          bio:'born in 1988 chef paula has been cooking for 30 years...'
        });
      });
  });

  it('can save password hash', () => {
    return User.create({
      email: 'chef@gmail.com',
      password: 'password123',
      role: 'chef',
      bio:'born in 1988 chef paula has been cooking for 30 years...'
    })
      .then(user => {
        expect(user.passwordHash).toEqual(expect.any(String));
        expect(user.password).toBeUndefined();
      });
  });

  it('has a required email', () => {
    const user = new User({});
    const errors = user.validateSync().errors;
    expect(errors.email.message).toEqual('Email required');
  });

  it('has a required role', () => {
    const user = new User({});
    const errors = user.validateSync().errors;
    expect(errors.role.message).toEqual('Role required');
  });

  it('has a bio', () => {
    const user = new User({});
    const errors = user.validateSync().errors;
    expect(errors.role.message).toEqual('Bio is a requireed field');
  });

  it('can compare good passwords', () => {
    return User.create({
      email: 'chef@gmail.com',
      password: 'abc123',
      role: 'chef'
    })
      .then(user => {
        return user.compare('abc123');
      })
      .then(result => {
        expect(result).toBeTruthy();
      });
  });

  it('can compare bad passwords', () => {
    return User.create({
      email: 'chef@gmail.com',
      password: 'abc123',
      role: 'chef'
    })
      .then(user => {
        return user.compare('badPassword');
      });
  });
});
