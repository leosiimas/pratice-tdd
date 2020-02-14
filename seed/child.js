const axios = require('axios');
const config = require('../config/config');

const { urlFunctions } = config;

const defaultChild = {
  name: 'Criança Test Leo',
  birthday: '20/12/2014',
  color: 'amarelo',
  sex: 'masculino',
  childLink: 'filho',
  userLink: 'pai',
};

const { headers } = config;

const getChild = async (newChild = null, newHeaders = null) => {
  const child = await axios
    .post(`${urlFunctions}/saveChild`, { ...defaultChild, ...newChild }, { headers: { ...headers, ...newHeaders } })
    .then((r) => {
      return r;
    })
    .catch((r) => {
      return r.response;
    });
  return child.data.result.child.objectId;
};

module.exports = { getChild };
