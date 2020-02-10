const axios = require('axios');
const config = require('../config/config');

const unique = new Date().getTime();

const { headers } = config;
const { url } = config;

const user = {
  name: 'User Test Leo',
  password: '123456',
  username: `${unique}@email.com`,
  email: `${unique}@email.com`,
};


test('Deve inserir uma conta com sucesso', async () => {
  const response = await axios
    .post(`${url}/users`, user, { headers })
    .then((r) => {
      return r;
    })
    .catch((r) => {
      return r.response;
    });

  expect(response.status).toBe(201);
  expect(response.statusText).toBe('Created');
  expect(response.data.objectId).not.toBeNull();
  expect(response.data.sessionToken).not.toBeNull();
});

test('Não deve inserir uma conta que ja exista o username/email', async () => {
  const response = await axios
    .post(`${url}/users`, user, { headers })
    .then((r) => {
      return r;
    })
    .catch((r) => {
      return r.response;
    });

  expect(response.status).toBe(400);
  expect(response.data.code).toBe(202);
  expect(response.data.error).toBe('Account already exists for this username.');
});

test('Não deve inserir uma conta sem o username', async () => {
  const u = { ...user };

  delete u.username;

  const response = await axios
    .post(`${url}/users`, u, { headers })
    .then((r) => {
      return r;
    })
    .catch((r) => {
      return r.response;
    });

  expect(response.status).toBe(400);
  expect(response.data.code).toBe(200);
  expect(response.data.error).toBe('bad or missing username');
});

test('Não deve inserir uma conta sem a senha', async () => {
  const u = { ...user };

  delete u.password;

  const response = await axios
    .post(`${url}/users`, u, { headers })
    .then((r) => {
      return r;
    })
    .catch((r) => {
      return r.response;
    });

  expect(response.status).toBe(400);
  expect(response.data.code).toBe(201);
  expect(response.data.error).toBe('password is required');
});
