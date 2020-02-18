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
  name: 'Member Test Leo',
  role: 'Viewer',
  children: [],
};

let newUser;
let newChild;

beforeAll(async () => {
  newUser = await user.getUser();
  newChild = await child.getChild(null, { 'X-Parse-Session-Token': newUser.sessionToken });
});

describe('Ao utilizar o endpoint Create Child Member', () => {

  test('Deve criar um membro para uma crianaça', async () => {

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

  // TODO arrumar não deve criar membro se nao foir editor
  test('Não deve criar um membro se não foir Editor da Criança', async () => {

    const secondUser = await user.getUser({ email: `${unique}user2@email.com`, username: `${unique}user2@email.com` });

    const response = await axios
      .post(`${urlFunctions}/createChildMember`, { ...newMember, children: [newChild] }, { headers: { ...headers, 'X-Parse-Session-Token': secondUser.sessionToken } })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    expect(response.status).toBe(400);

  });

  const testTemplate = async (newData) => {
    const response = await axios
      .post(`${urlFunctions}/createChildMember`, { ...newMember, children: [newChild], ...newData }, { headers: { ...headers, 'X-Parse-Session-Token': newUser.sessionToken } })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    expect(response.status).toBe(400);
    expect(response.data.code).toBe(141);
    expect(response.data.error).toBe('Oops! Missing parameter in this request.');
  };

  test('Não deve criar membro sem nome', () => testTemplate({ name: null }));
  test('Não deve criar membro sem email', () => testTemplate({ email: null }));
  test('Não deve criar membro sem criança relacionada', () => testTemplate({ children: null }));
  test('Não deve criar membro sem role', () => testTemplate({ role: null }));
  test('Não deve criar membro sem parentesco com a crinaça', () => testTemplate({ userLink: null }));
});

// TODO maneira de pegar o convite
describe('Membro pode se cadastrar pelos endpoints LinkInvite e SignUpInvite', () => {

});

describe('Ao utilizar o endpoint View Child Member', () => {s
});

describe('Ao utilizar o endpoint Get All Child Member', () => {

});

describe('Ao utilizar o endpoint Delete Child Member', () => {

});
