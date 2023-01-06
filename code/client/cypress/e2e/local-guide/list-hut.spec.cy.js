describe('List huts for a Local Guide', () => {
    before(() => {
        cy.clearAll()
        cy.createUserWithDetails({ role: "Local Guide" })
        cy.createHut({ writer: 1 })
        cy.loginAsLocalGuide()
        cy.viewport(1200, 1200)
    })

    beforeEach(() => cy.visit('/account/huts'))
    after(() => cy.clearAll())

    it('Should allows users to see the list of available huts', () => {
        cy.findAllByText(/Update/i).should('have.length', 1)
    })
})