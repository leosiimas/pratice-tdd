const axios = require('axios');
const config = require('../config/config');

const { urlFunctions } = config;

const newChild = {
  name: 'Nova Crinça',
  birthday: '20/12/2014',
  color: 'amarelo',
  sex: 'masculino',
  childLink: 'filho',
  userLink: 'pai',
};

const { user1 } = config;

const getChild = async () => {
  const child = await axios
    .post(`${urlFunctions}/saveChild`, newChild, { headers: user1.headers })
    .then((r) => {
      return r;
    })
    .catch((r) => {
      return r.response;
    });
  return child.data.result.child.objectId;
};

module.exports = { getChild };
