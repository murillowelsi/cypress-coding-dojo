import * as GETproducts from '../Produtos/requests/GETprodutos.request'

describe('Produtos', () => {
    context('GET /produtos', () => {
        it('expect all products', () => {
            GETproducts.allProducts()            
            .should((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.quantidade).to.eq(3)
                expect(response.body.produtos).to.be.an('array')
                expect(response.body.produtos[0].nome).to.eq("tapioca7 com tucuma7")
            })
        });
    });

    context('GET /produtos + query param', () => {
        it('expect one product', () => {
            GETproducts.productById({
                _id: 'BeeJh5lz3k6kSIzA'
            }).should((response) => {
                cy.log(JSON.stringify(response.body))
            })
        });
    });
});