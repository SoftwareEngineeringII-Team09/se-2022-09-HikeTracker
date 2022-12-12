describe('Browse hikes', () => {
    before(() => {
        cy.clearAll()
        cy.createUserWithDetails({ role: "Local Guide" })
        cy.createHike({ writer: 1 })
    })

    beforeEach(() => cy.visit('/hikes'))
    after(() => cy.clearAll())

    it('should allows users to see the list of available hikes', () => {
        cy.findAllByRole("button", { name: /See more details/ }).should('have.length', 1)
    })
})