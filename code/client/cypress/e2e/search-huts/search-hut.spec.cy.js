describe('Search huts', () => {
    before(() => {
        cy.clearAll()
        cy.createUserWithDetails({ role: "Hiker" })
        cy.createHut({ writer: 1 })
    })

    beforeEach(() => cy.visit('/huts'))
    after(() => cy.clearAll())

    it('should allows users to see the list of available huts', () => {
        cy.findAllByRole("button", { name: /See more details/ }).should('have.length', 1)
    })
})