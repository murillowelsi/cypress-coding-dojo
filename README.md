# Dojo Session

[![Badge ServeRest](https://img.shields.io/badge/API-ServeRest-green)](https://github.com/ServeRest/ServeRest/)

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

> **Por que usar o Cypress?**  
>
> O Cypress é um framework de testes automatizados amigável e fácil de usar. Para começar a escrever seus testes 
> automatizados nenhuma configuração é necessária. 
> Todas as ferramentas de teste de unidade com as quais você já está familiarizado estão incluídas. 
>
> *Com o Cypress você pode:*
>
> - testes de e2e;
> - testes de unidades;
> - testes de componentes;
> - testes de API;
> - testes de testes de regressão visual;
> - e até mesmo pode combinar todos eles.

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
    "cypress:run": "./node_modules/.bin/cypress run --spec **/*.spec.js"
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
describe('Mocha’s interface - BDD', () => {
  context('it provides a way to keep tests easier to read and organized.', () => {
    it('This is your test case', () => {
      expect(true).to.eq(true)
    });
  });
});
```

```javascript
/// <reference types="cypress" />

describe('Products api', () => {
  context('GET /produtos', () => {
    it('should return an array with all products', () => {
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

describe('Products api', () => {
  context('GET /produtos', () => {
    it('should return an array with all products', () => {
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

  context('GET /produtos + query string', () => {
    it('should return an array with only the filtered product', () => {
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

describe('Products api', () => {
  context('GET /produtos', () => {
    it('should return an array with all products', () => {
      GETprodutos.allProducts()

        .should((response) => {
          cy.log(response.body)
          expect(response.status).to.eq(200)
          expect(response.body.quantidade).to.eq(2)
        });

    });
  });

  context('GET /produtos + query string', () => {
    it('should return an array with only the filtered product', () => {
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

### Passo 3: CI - Executando testes no Github Actions

Para criar um pipeline de execução dos nossos testes usando o Github Actions, crie um diretório na raíz do projeto com 
o nome `.github` e dentro dela outro diretório chamado `workflows`. Dentro de workflows crie um arquivo chamado `actions.yml`
com o seguinte conteúdo:

```YML
name: Cypress CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x]

    steps:
    - uses: actions/checkout@v2
    - name: Cypress tests using Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm i
    - run: npm run cypress:run

```

Pronto, a cada commit no nosso código, todas as specs serão executadas no pipeline do Github.

[Voltar para o topo](#dojo-session)
