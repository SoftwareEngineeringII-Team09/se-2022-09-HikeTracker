describe('List hikes for a Local Guide', () => {
    before(() => {
        cy.clearAll()
        cy.createUserWithDetails({ role: "Local Guide" })
        cy.createHike({ writer: 1 })
        cy.loginAsLocalGuide()
    })

    beforeEach(() => cy.visit('/account/hikes'))
    after(() => cy.clearAll())

    it('should allows users to see the list of available hikes', () => {
        cy.findAllByText(/Trail/i).should('have.length', 1)
    })
})