const axios = require('axios');
const child = require('../seed/child');
const config = require('../config/config');

const children = [];

const seedChildren = async () => {
  children.push(await child.getChild().then((r) => { return r; }));
  children.push(await child.getChild().then((r) => { return r; }));
  children.push(await child.getChild().then((r) => { return r; }));
};

const { urlFunctions } = config;

const { user1 } = config;
const { user2 } = config;
// const { user3 } = config;

const newContact = {
  name: 'Contato 6',
  phone: '123231232',
  email: 'silva@email.com',
  children,
};

beforeAll(async () => {
  await seedChildren();
});

describe.skip('Ao utilizar o endpoint Save Contact', () => {

  describe('Em caso de Sucesso', () => {
    test('Deve retornar as informaçoes do Contato', async () => {
      const response = await axios
        .post(`${urlFunctions}/saveContact`, newContact, { headers: user1.headers })
        .then((r) => {
          return r;
        })
        .catch((r) => {
          return r.response;
        });

      expect(response.status).toBe(200);
      expect(response.data.result.children.length).toBe(3);
      expect(response.data.result.email).toBe(newContact.email);
    });

    test('Deve atualizar as informações do Contato', async () => {
      const c = await axios
        .post(`${urlFunctions}/saveContact`, newContact, { headers: user1.headers })
        .then((r) => {
          return r;
        })
        .catch((r) => {
          return r.response;
        });

      const id = c.data.result.objectId;

      const ncontact = {
        ...newContact,
        name: 'Nome Alterado',
        email: 'email@alterado.com',
        id,
      };

      const response = await axios
        .post(`${urlFunctions}/saveContact`, ncontact, { headers: user1.headers })
        .then((r) => {
          return r;
        })
        .catch((r) => {
          return r.response;
        });

      expect(response.status).toBe(200);
      expect(response.data.result.children.length).toBe(3);
      expect(response.data.result.email).toBe(ncontact.email);
      expect(response.data.result.name).toBe(ncontact.name);

    });
  });

  describe('Em caso de falha', () => {

    const testTemplate = async (nowData) => {
      const response = await axios
        .post(`${urlFunctions}/saveContact`, { ...newContact, ...nowData }, { headers: user1.headers })
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

    test('Não deve criar contato sem nome', () => testTemplate({ name: null }));
    test('Não deve criar criança sem criança', () => testTemplate({ children: null }));

    // TODO arrumar validações
    test('Não deve criar contato com uma conta que não é Editor da criança', async () => {

      const c = await axios
        .post(`${urlFunctions}/saveContact`, newContact, { headers: user1.headers })
        .then((r) => {
          return r;
        })
        .catch((r) => {
          return r.response;
        });

      const id = c.data.result.objectId;

      const ncontac = {
        ...newContact,
        children: children[0],
        id,
      };

      const response = await axios
        .post(`${urlFunctions}/saveContact`, ncontac, { headers: user2.headers })
        .then((r) => {
          return r;
        })
        .catch((r) => {
          return r.response;
        });

      expect(response.status).toBe(400);
      expect(response.data.code).toBe(111);
      expect(response.data.error).toBe('Oops! Missing parameter in this request.');

    });
  });

});

describe.skip('Ao utilizar o endpoint View Contact', () => {

  test('Deve retornar todas a informações do Contato', async () => {
    const c = await axios
      .post(`${urlFunctions}/saveContact`, newContact, { headers: user1.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    const id = c.data.result.objectId;

    const response = await axios
      .post(`${urlFunctions}/viewContact`, { id }, { headers: user1.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    expect(response.status).toBe(200);
    expect(response.data.result.children.length).toBe(3);
    expect(response.data.result.email).toBe(newContact.email);
    expect(response.data.result.objectId).toBe(id);

  });

  test('Não deve atualizar contato se o id não foir passado por parametro', async () => {
    const response = await axios
      .post(`${urlFunctions}/viewContact`, {}, { headers: user1.headers })
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

  // TODO arrumar validações
  test('Não deve visualizar o contato se não tiver relação com a criança do contato', async () => {
    const c = await axios
      .post(`${urlFunctions}/saveContact`, newContact, { headers: user1.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    const id = c.data.result.objectId;

    const response = await axios
      .post(`${urlFunctions}/viewContact`, { id }, { headers: user2.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    expect(response.status).toBe(400);
  });

});

describe.skip('Ao utiliza o endpoint Delete Contact', () => {

  test('Deve retornar retornar mensagem de contato deletado em caso de sucesso', async () => {
    const c = await axios
      .post(`${urlFunctions}/saveContact`, newContact, { headers: user1.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    const id = c.data.result.objectId;

    const response = await axios
      .post(`${urlFunctions}/deleteContact`, { id }, { headers: user2.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    expect(response.status).toBe(200);
    expect(response.data.result).toBe('Contact successfully deleted');
  });

  test('Não deve deletar contato se o id não for passado por parametro ', async () => {
    const response = await axios
      .post(`${urlFunctions}/deleteContact`, {}, { headers: user1.headers })
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

  // TODO arrumar validações arruma caso de contato inexistente
  test('Não deve deletar contato que não tenha permissão', async () => {
    const c = await axios
      .post(`${urlFunctions}/saveContact`, newContact, { headers: user1.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    const id = c.data.result.objectId;

    const response = await axios
      .post(`${urlFunctions}/deleteContact`, { id }, { headers: user2.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    expect(response.status).toBe(400);
  });

});

describe('Ao utilizar o endpoint Get Contact Child', () => {
  test('Deve retornar todos os contatos das crianças selecionadas', async () => {

    await axios
      .post(`${urlFunctions}/saveContact`, newContact, { headers: user1.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    const response = await axios
      .post(`${urlFunctions}/getContactChild`, { children }, { headers: user1.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    expect(response.status).toBe(200);
    expect(response.data.result.length).toBe(1);
  });

  test('Deve retornar mensagem de criança sem contato caso criança não tenha contato', async () => {

    const newChild = await child.getChild({ name: 'Nome Diferente' }).then((r) => { return r; });

    const response = await axios
      .post(`${urlFunctions}/getContactChild`, { children: [newChild] }, { headers: user1.headers })
      .then((r) => {
        return r;
      })
      .catch((r) => {
        return r.response;
      });

    console.log(response);

    expect(response.status).toBe(200);
    expect(response.data.result).toBe('child without contact');
  });
});
