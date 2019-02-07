const config = require('../config');
const { setToken } = require('./token');
const inquirer = require('inquirer');
const request = require('superagent');

console.log('select', require('./select'));

module.exports = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Email'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password'
    },
    {
      type: 'checkbox',
      name: 'role',
      message: 'Select your role',
      choices: ['visitor', 'chef']
    }
  ])
    .then(({ email, password, role }) => {
      return request
        .post(`${config.url}/auth/signin`)
        .send({ email, password, role });
    })
    .then(res => {
      setToken(res.body.token);
    });
};