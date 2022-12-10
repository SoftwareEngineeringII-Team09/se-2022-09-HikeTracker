import { SERVER_URL, TOAST_SUCCESS_NOTIFICATION } from '../../fixtures/constants'

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

        cy.intercept({
            method: 'PUT',
            url: `${SERVER_URL}/hikes/1/huts`
        }).as('update-linked-huts-xhr')

        cy.get('img[alt="Marker"]').click({ force: true });
        cy.findByRole('button', { name: /Link this hut to the hike/i }).click()
        cy.findByRole('button', { name: /save changes/i }).click()
        cy.wait('@update-linked-huts-xhr').then((xhr) => {
            cy.get(TOAST_SUCCESS_NOTIFICATION).should('contain.text', "Linked huts have been correctly updated");
        })
    })
})