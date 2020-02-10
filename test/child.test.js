const axios = require('axios');
const config = require('../config/config');

const { user1 } = config;
const { user2 } = config;
const { user3 } = config;

const newChild = {
  name: 'Nova Crinça',
  birthday: '20/12/2014',
  color: 'amarelo',
  sex: 'masculino',
  childLink: 'filho',
  userLink: 'pai',
};

const { urlFunctions } = config;

let id;

beforeEach(async () => {
  const child = await axios
    .post(`${urlFunctions}/saveChild`, newChild, { headers: user1.headers })
    .then((r) => {
      return r;
    })
    .catch((r) => {
      return r.response;
    });

  id = child.data.result.child.objectId;
});

describe('Ao utilizar o endpoint Save Child', () => {

  describe('Em caso de sucesso:', () => {
    test('Deve Cadastrar uma Criança', async () => {
      const response = await axios
        .post(`${urlFunctions}/saveChild`, newChild, { headers: user1.headers })
        .then((r) => {
          return r;
        })
        .catch((r) => {
          return r.response;
        });

      expect(response.status).toBe(200);
      expect(response.data.result.isOwner).toBe(true);
      expect(response.data.result.role.name).toBe('Editor');
      expect(response.data.result.user.objectId).toBe(user1.data.id);
      expect(response.data.result.child.name).toBe(newChild.name);
    });

    test('Deve Atualizar uma Crinaça', async () => {
      const c = { ...newChild };
      const updateChild = {
        ...c,
        name: 'Criança Alterada',
        id,
      };

      const response = await axios
        .post(`${urlFunctions}/saveChild`, updateChild, { headers: user1.headers })
        .then((r) => {
          return r;
        })
        .catch((r) => {
          return r.response;
        });

      expect(response.status).toBe(200);
      expect(response.data.result.role.name).toBe('Editor');
      expect(response.data.result.user.objectId).toBe(user1.data.id);
      expect(response.data.result.child.name).toBe(updateChild.name);
    });
  });

  describe('Em caso de falha:', () => {

    describe('Ao criar criança sem os parametros', () => {
      let child;
      beforeAll(() => {
        child = {
          name: 'Criança Teste Leo',
          birthday: '20/12/2014',
          color: 'amarelo',
          sex: 'masculino',
          childLink: 'filho',
          userLink: 'pai',
        };
      });

      const testTemplate = async (nowData) => {
        const response = await axios
          .post(`${urlFunctions}/saveChild`, { ...child, ...nowData }, { headers: user1.headers })
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

      test('Não deve criar criança sem nome', () => testTemplate({ name: null }));
      test('Não deve criar criança sem data de aniversario', () => testTemplate({ birthday: null }));
      test('Não deve criar criança sem cor', () => testTemplate({ color: null }));
      test('Não deve criar criança sem sexo', () => testTemplate({ sex: null }));
      test('Não deve criar criança sem parentesco com usuario', () => testTemplate({ userLink: null }));
    });

    test('Não deve atualizar uma criança que não tenha permissão ', async () => {
      const c = { ...newChild };
      const updateChild = {
        ...c,
        name: 'Criança Alterada',
        id,
      };

      const response = await axios
        .post(`${urlFunctions}/saveChild`, updateChild, { headers: user2.headers })
        .then((r) => {
          return r;
        })
        .catch((r) => {
          return r.response;
        });

      expect(response.status).toBe(400);
      expect(response.data.code).toBe(141);
      expect(response.data.error).toBe('User dont have relationship whit child');
    });
  });
});

describe('Ao utilizar o endpoint View Child', () => {

  describe('Em caso de sucesso', () => {

    test('Deve Retornar relação User Child', async () => {

      const response = await axios
        .post(`${urlFunctions}/viewChild`, { id }, { headers: user1.headers })
        .then((r) => {
          return r;
        })
        .catch((r) => {
          console.log(r);
          return r.response;
        });

      expect(response.status).toBe(200);
      expect(response.data.result.isOwner).toBe(true);
      expect(response.data.result.role.name).toBe('Editor');
      expect(response.data.result.user.objectId).toBe(user1.data.id);
      expect(response.data.result.child.name).toBe(newChild.name);
    });

  });

  describe('Em caso de falha', () => {

    test('Deve retornar mensagem de erro caso falte o id da criança', async () => {
      const response = await axios
        .post(`${urlFunctions}/viewChild`, {}, { headers: user1.headers })
        .then((r) => {
          return r;
        })
        .catch((r) => {
          return r.response;
        });

      expect(response.status).toBe(400);
      expect(response.data.code).toBe(141);
      expect(response.data.error).toBe('Oops! Missing parameter in this request.');
    });

    test('Deve retornar mensagem de erro caso o usuario não tenha relação com a criança', async () => {
      const response = await axios
        .post(`${urlFunctions}/viewChild`, { id }, { headers: user2.headers })
        .then((r) => {
          return r;
        })
        .catch((r) => {
          return r.response;
        });

      expect(response.status).toBe(400);
      expect(response.data.code).toBe(141);
      expect(response.data.error).toBe('child without relationship with user ');
    });

  });
});

describe('Ao utilizar o endpoint Get All Child', () => {
  test('Deve retornar todas as crianças relacionadas com o usuario', async () => {
    const response = await axios
      .post(`${urlFunctions}/getAllChild`, {}, { headers: user1.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    expect(response.status).toBe(200);
    const r = response.data.result;
    expect(r.length).toBeGreaterThan(0);
    r.forEach((uc) => {
      expect(uc.user.objectId).toBe(user1.data.id);
    });

  });

  test('Não deve retornar crianças caso o usuario não tenha nenhuma criança vinculada', async () => {
    const response = await axios
      .post(`${urlFunctions}/getAllChild`, {}, { headers: user3.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    expect(response.status).toBe(200);
    const r = response.data.result;
    expect(r.length).toEqual(0);
  });

});

describe('Ao utilizar o endpoint Delete Child', () => {

  test('Não deve deletar uma criança que eu não seja Owner', async () => {
    const response = await axios
      .post(`${urlFunctions}/deleteChild`, { id }, { headers: user2.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });


    expect(response.status).toBe(400);
    expect(response.data.code).toBe(141);
    expect(response.data.error).toBe('child without link with user ');

  });

  test('Deve deletar uma Criança', async () => {

    const response = await axios
      .post(`${urlFunctions}/deleteChild`, { id }, { headers: user1.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    expect(response.status).toBe(200);
    expect(response.data.result).toBe('Child successfully deleted');
  });

  test('Não deve deletar uma criança caso o id não seja passado', async () => {
    const response = await axios
      .post(`${urlFunctions}/deleteChild`, {}, { headers: user1.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    expect(response.status).toBe(400);
    expect(response.data.code).toBe(141);
    expect(response.data.error).toBe('Oops! Missing parameter in this request.');

  });

});
