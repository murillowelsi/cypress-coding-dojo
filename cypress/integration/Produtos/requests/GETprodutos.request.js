function allProducts() {
    return cy.request({
        method: 'GET',
        url: 'https://serverest.dev/produtos'
    })
}

function productById(query) {
    return cy.request({
        method: 'GET',
        url: 'https://serverest.dev/produtos',
        qs: query
    })
}

export { allProducts, productById }