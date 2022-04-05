const user = {
  name: 'micheal Awoniran',
  email: 'awoniranopeyemi@gmail.com',
  password: 'micheal',
  order: 'rice and chicken',
  checkeout: true,
};
const response = require('../../utils/res/response');

function HttpGetUser(req, res, next) {
  return response(res, 200, 'success,', user);
}

function HttpGetAllUser(req, res, next) {}

// async function

module.exports = {
  HttpGetAllUser,
  HttpGetUser,
};
