require('dotenv/config');

const headers = {
  'X-Parse-Application-Id': process.env.X_PARSE_APPLICATION_ID,
  'X-Parse-REST-API-Key': process.env.X_PARSE_REST_API_KEY,
  'Content-Type': 'application/json',
};

const user1 = {
  headers: {
    ...headers,
    'X-Parse-Session-Token': 'r:940eb320ef9a3c099235ff36b8bdf553',
  },
  data: {
    id: 'tpnavlPiAL',
  },
};

const user2 = {
  headers: {
    ...headers,
    'X-Parse-Session-Token': 'r:b6625b28a7e78c7b16b450fa0d6fe293',
  },
  data: {
    id: 'mf8L3jriMk',
  },
};

const user3 = {
  headers: {
    ...headers,
    'X-Parse-Session-Token': 'r:4b78f711f6dc559443a4d66dbefaed15',
  },
  data: {
    id: 'AxqmYRmBwE',
  },
};

const url = 'http://dev.api.filhosemdia.com.br/parse';
const urlFunctions = 'http://dev.api.filhosemdia.com.br/parse/functions';

module.exports = {
  headers, url, urlFunctions, user1, user2, user3,
};
