describe('List of completed hikes for an hiker', () => {
    before(() => {
        cy.clearAll()
        cy.createUserWithDetails({ role: "Hiker" })
        cy.createHike({ writer: 1 })
        cy.loginAsHiker()
        cy.addCompletedHike({ hiker: 1, hike: 1 })
    })

    beforeEach(() => cy.visit('/hikes/completed'))
    after(() => cy.clearAll())

    it('should allows hiker to see the list of completed hikes', () => {
        cy.findAllByText(/Started/i).should('have.length', 1)
    })
})