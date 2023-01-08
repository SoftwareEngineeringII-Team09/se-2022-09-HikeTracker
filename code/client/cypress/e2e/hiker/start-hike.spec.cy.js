describe('Start hike', () => {
    before(() => {
        cy.clearAll()
        cy.createUserWithDetails({ role: "Local Guide" })
        cy.createHike({ writer: 1 })
        cy.createHikerUser()
        cy.loginAsHiker()
    })

    after(() => cy.clearAll())

    it('should allow logged in users to see hike details and trackmap', () => {
        cy.visit('/hikes/1')
        cy.findByRole("button", { name: /start this hike/i }).click({ force: true })
        cy.findByTestId(/timewatch/i).should('be.visible');
    })
})