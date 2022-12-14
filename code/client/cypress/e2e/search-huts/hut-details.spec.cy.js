describe('Hut details', () => {
    before(() => {
        cy.clearAll()
        cy.createUserWithDetails({ role: "Local Guide" })
        cy.createHut({ writer: 1 })
        cy.loginAsLocalGuide()
    })

    after(() => cy.clearAll())

    it('should allow logged in hikers to see hut details', () => {
        cy.visit('/huts')
        cy.findAllByRole("button", { name: /See more details/ }).first().click()
        cy.fixture('hut').then(json => {
            cy.findByText(json.hutName).should('be.visible')
        })
    })
})