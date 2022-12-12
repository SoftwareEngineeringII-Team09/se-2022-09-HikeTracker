import { SERVER_URL, TOAST_SUCCESS_NOTIFICATION, CLIENT_URL } from '../../fixtures/constants'

describe('Update linked huts', () => {
    before(() => {
        cy.clearAll()
        cy.createUserWithDetails({ role: "Local Guide" })
        cy.createHike({ writer: 1 })
        cy.createHut({ writer: 1 })
        cy.loginAsLocalGuide()
    })

    beforeEach(() => cy.visit('/account/hikes/1/update/linked-huts'))
    after(() => cy.clearAll())

    it('should allows local guide to update linked huts for an hike', () => {

        cy.on('uncaught:exception', (err, runnable) => {
            return false
        });

        cy.get('img[alt="Marker"]').click({ force: true });
        cy.findByRole('button', { name: /Link this hut to the hike/i }).click()
        cy.findByRole('button', { name: /save changes/i }).click()

        cy.url().should('eq', `${CLIENT_URL}hikes/1`)

        cy.get(TOAST_SUCCESS_NOTIFICATION).should('contain.text', "Linked huts have been correctly updated");
        cy.findByText(/rifugio santa claus/i).should('be.visible')
    })
})