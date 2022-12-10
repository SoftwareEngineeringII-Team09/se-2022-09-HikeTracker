describe('List huts for a Local Guide', () => {
    before(() => {
        cy.clearAll()
        cy.createUserWithDetails({ role: "Local Guide" })
        cy.createHut({ writer: 1 })
        cy.loginAsLocalGuide()
    })

    beforeEach(() => cy.visit('/account/huts'))
    after(() => cy.clearAll())

    it('should allows users to see the list of available huts', () => {
        cy.findAllByText(/Update/i).should('have.length', 1)
    })
})