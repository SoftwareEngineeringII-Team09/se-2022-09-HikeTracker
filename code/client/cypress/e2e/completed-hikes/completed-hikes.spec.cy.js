describe('List of completed hikes for an hiker', () => {
    before(() => {
        cy.clearAll()
        cy.createUserWithDetails({ role: "Local Guide" })
        cy.createHike({ writer: 1 })
        cy.createHikerUser()
        cy.loginAsHiker()
        cy.addCompletedHike({ selectedHike: 1, hike: 1, hiker: 2, status: 'finished', startTime: '01/01/2023, 01:01:01', endTime: '02/02/2023, 02:02:02' })
    })

    beforeEach(() => cy.visit('/hikes/completed'))
    after(() => cy.clearAll())

    it('should allows hiker to see the list of completed hikes', () => {
        cy.findAllByText(/Started/i).should('have.length', 1)
    })
})