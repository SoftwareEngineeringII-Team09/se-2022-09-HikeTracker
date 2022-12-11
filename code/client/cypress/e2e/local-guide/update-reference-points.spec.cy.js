import { SERVER_URL } from '../../fixtures/constants'

describe('Update reference points', () => {
    before(() => {
        cy.clearAll()
        cy.createUserWithDetails({ role: "Local Guide" })
        cy.createHike({ writer: 1 })
        cy.loginAsLocalGuide()
    })

    beforeEach(() => cy.visit('/account/hikes/1/update/reference-points'))
    after(() => cy.clearAll())

    it('should allows local guide to update reference points for an hike', () => {

        // Just because is too hard click on a track point within the map
        // the body is set by means a fixture
        cy.fixture('local-guide/update-reference-points').then(json => {
            cy.intercept({
                method: 'PUT',
                url: `${SERVER_URL}/hikes/1/refPoints`
            }, (req) => {
                req.body = json.body
            }).as('update-reference-points-xhr')
        })

        cy.findByRole('button', { name: /save changes/i }).click()
        cy.wait('@update-reference-points-xhr').then(() => {
            cy.findByText(/amazing view/i).should('be.visible')
        })
    })
})