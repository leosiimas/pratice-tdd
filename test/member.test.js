const axios = require('axios');
const config = require('../config/config');
const child = require('../seed/child');
const user = require('../seed/user');

const { urlFunctions } = config;
const { headers } = config;

const unique = new Date().getTime();

const newMember = {
  email: `leonardo.abreu+${unique}@mocka.email`,
  userLink: 'tio',
  childLink: 'sobrinho',
  name: 'João da Silva',
  role: 'Viewer',
  children: [],
};

describe('Ao utilizar o endpoint Create Child Member', () => {

  test('Deve criar um membro para uma crianaça', async () => {

    const newUser = await user.getUser();
    const newChild = await child.getChild();

    const response = await axios
      .post(`${urlFunctions}/createChildMember`, { ...newMember, children: [newChild] }, { headers: { ...headers, 'X-Parse-Session-Token': newUser.sessionToken } })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    expect(response.status).toBe(200);
    expect(response.data.result).toBe('Successfully invited members');

  });

});
