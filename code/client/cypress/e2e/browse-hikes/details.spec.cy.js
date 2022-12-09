describe('Hike details', () => {
    before(() => {
        cy.clearAll()
        cy.createHike()
    })

    after(() => cy.clearAll())

    it('should allow visitors to see main hike details', () => {
        cy.visit('/hikes')
        cy.findAllByRole("button", { name: /See more details/ }).first().click()
        cy.fixture('hike').then(json => {
            cy.findByText(json.title).should('be.visible')
            cy.findByRole("button", /download/i).not().should('exist')
        })
    })

    it('should allow logged in users to see hike details and trackmap', () => {
        cy.loginAsLocalGuide()
        cy.visit('/hikes')
        cy.findAllByRole("button", { name: /See more details/ }).first().click()
        cy.fixture('hike').then(json => {

            cy.findByText(json.title).should('be.visible')
            cy.findAllByRole("button", /download/i).should('exist')
            cy.get(".track-map").should('be.visible')
        })
    })
})