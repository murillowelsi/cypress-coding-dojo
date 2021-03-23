# Dojo Session

[![Badge ServeRest](https://img.shields.io/badge/API-ServeRest-green)](https://github.com/ServeRest/ServeRest/)

## Testes de API com Cypress

Coding Dojo é uma prática de treino de programação onde programadores se reunem em um local físico (em tempos normais),
escolhe um desafio/problema e começa a desenvolver juntos a solução para este problema, seguindo algumas regras que 
farão com que seja possível que todos participem no desenvolvimento da solução.

**No Coding Dojo:**

- Não importa se você é iniciante ou experiente.
- O objetivo é você aprender algo ou compartilhar algo que tem experiência.
- A idéia não é finalizar um projeto completo, e sim trocar experiências.
- Desenvolver a solução em baby steps:
    - Vamos desenvolver usando TDD, desevolvendo testes simples primeiro e depois incrementando o código.
    - Daremos sempre preferência para a implementação mais básica, e depois vamos refatorando o código para deixá-lo 
    mais robusto.

## Objetivos

1. Acessar o endereço da API [Serverest](https://serverest.dev/).
2. Usar o método GET para retornar informações.
3. Interagir com o objeto retornado.
4. Verificar o conteúdo do body do response.

### Passo 1: Criar um projeto Cypress

Primeiro, vamos iniciar um projeto node digitando o comando:

```bash
npm init
```

Depois vamos instalar o Cypress no projeto:

```bash
npm i cypress -D
```

Agora vamos adicionar as seguinte linhas no arquivo `package.json`:

```javascript
"scripts": {
    "cypress:open": "./node_modules/.bin/cypress open",
    "cypress:run": "./node_modules/.bin/cypress run"
```

Esses comando servirão para executarmos os nossos testes.

Para iniciar o projeto **Cypress** execute o comando:

```bash
npm run cypress:open
```

Após executar esse comando, uma estrutura de projeto será criada.

Vamos então limpar o conteúdo do diretório `integration`. Depois vamos criar um diretório dentro em `integration`
chamado `Produtos`.

### Passo 2: Criando o primeiro teste

Dentro de `Produtos` vamos criar um arquivo chamado `GETprodutos.spec.js`, e vamos começar a escrever os nossos testes:

```javascript
/// <reference types="cypress" />

context('Given I access the API URI', () => {
  describe('When I do GET', () => {
    it('Then the response body should be valid', () => {
      cy.request({
        method: 'GET',
        url: 'https://serverest.dev/produtos'
      })
      
      .should((response) => {
        console.log(response.body)
        expect(response.status).to.eq(200)
        expect(response.body.quantidade).to.eq(2)
      });
      
    });
  });
});
```

Se quisermos adicionar um novo teste a este contexto, basta criar um novo bloco de `describe` e `it`

```javascript
/// <reference types="cypress" />

context('Given I have access Serverest API', () => {
  describe('When I do GET /products', () => {
    it('Then it should return all products', () => {
      cy.request({
        method: 'GET',
        url: 'https://serverest.dev/produtos'
      })

        .should((response) => {
          cy.log(response.body)
          expect(response.status).to.eq(200)
          expect(response.body.quantidade).to.eq(2)
        })

    });
  });

  describe('When I do GET /products filtering by id', () => {
    it('Then it should return only the product filtered', () => {
      cy.request({
        method: 'GET',
        url: 'https://serverest.dev/produtos',
        qs: {
          _id: 'BeeJh5lz3k6kSIzA'
        }
      })
      
      .should((response) => {
        expect(response.body.produtos).to.be.an('array')
        expect(response.body.produtos[0])
        .to.contains({
          nome: "Logitech MX Vertical",
          preco: 470,
          descricao: "Mouse",
          quantidade: 382,
          _id: "BeeJh5lz3k6kSIzA"
        })
      })

    });
  });
});
```

Note que foi necessário duplicar o método **GET** com as mesmas informações. Como melhorar podemos esse código?

Vamos encapsular o request **GET** em um arquivo separado, para que possamos reutilizá-lo sempre que necessário.
Nossa estrutura de Projeto ficará assim:

#### Diretório Produtos

Séra o diretório responsável por armazenar todas as requisições relacionadas a Produtos. Detro dele teremos os diretórios:

- `requests`
- `tests`

##### Dretório request

Será o diretório responsável por armazenar nossas **requisições HTTP**, exemplo:

- `GETprodutos.request.js`
- `POSTprodutos.request.js`
- `PUTprodutos.request.js`
- `DELETEprodutos.request.js`

##### Diretório tests

Será o diretório responsável por armazenar nossos **testes**, exemplo:

- `GETprodutos.spec.js`
- `POSTprodutos.spec.js`
- `PUTprodutos.spec.js`
- `DELETEprodutos.spec.js`

Vamos adicionar a `baseUrl` no arquivo `cypress.json`:

```javascript
{
  "baseUrl": "https://serverest.dev",
  "video": false
}
```

Depois criaremos o arquivo `GETprodutos.request.js` dentro do diretório `requests`. Nesse arquivo iremos criar uma 
função que será responsável por fazer o **GET** no endpoint `/produtos`:

```javascript
/// <reference types="cypress" />

function allProducts() {
  return cy.request({
    method: 'GET',
    url: '/produtos',
    failOnStatusCode: false
  });
};

export { allProducts };
```

> Não se esqueça de exportar a função criada.

No arquivo `GETprodutos.spec.js` importe a função criada:

```javascript
import * as GETprodutos from '../requests/GETprodutos.request';
```

Substitua o request pela função criada anteriormente:

```javascript
/// <reference types="cypress" />

import * as GETprodutos from '../requests/GETprodutos.request';

context('Given I access the API URI', () => {
  describe('When I do GET all producs', () => {
    it('Then it should return all products', () => {
      GETprodutos.allProducts()

        .should((response) => {
          cy.log(response.body)
          expect(response.status).to.eq(200)
          expect(response.body.quantidade).to.eq(2)
        });

    });
  });

  describe('When I do GET product filtering by id', () => {
    it('Then it should return only the product filtered', () => {
      GETprodutos.allProducts()
      
      .should((response) => {
        expect(response.body.produtos).to.be.an('array')
        expect(response.body.produtos[0])
        .to.contains({
          nome: "Logitech MX Vertical",
          preco: 470,
          descricao: "Mouse",
          quantidade: 382,
          _id: "BeeJh5lz3k6kSIzA"
        });
      });

    });
  });
});
```

[Voltar para o topo](#dojo-session)
