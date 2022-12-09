describe('Browse hikes', () => {
    before(() => {
        cy.clearAll()
        cy.createHike()
    })

    beforeEach(() => cy.visit('/hikes'))
    after(() => cy.clearAll())

    it('should allows users to see the list of available hikes', () => {
        cy.findAllByRole("button", { name: /See more details/ }).should('have.length', 1)
    })
})