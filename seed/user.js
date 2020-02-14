const axios = require('axios');
const config = require('../config/config');

const unique = new Date().getTime();

const { headers } = config;
const { url } = config;


const defaultUser = {
  name: 'User Test Leo',
  password: '123456',
  username: `${unique}user@email.com`,
  email: `${unique}user@email.com`,
};

const getUser = async (newUser = null) => {

  const { data } = await axios
    .post(`${url}/users`, { ...defaultUser, ...newUser }, { headers })
    .then((r) => {
      return r;
    })
    .catch((r) => {
      return r.response;
    });

  return ({ id: data.objectId, sessionToken: data.sessionToken });
};

module.exports = { getUser };
