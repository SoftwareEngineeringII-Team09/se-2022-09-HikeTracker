import { TOAST_SUCCESS_NOTIFICATION } from '../../fixtures/constants'

describe('Add new parking lot', () => {
    before(() => {
        cy.clearAll()
        cy.createUserWithDetails({ role: "Local Guide" })
        cy.loginAsLocalGuide()

        cy.viewport(1200, 1200)
    })

    beforeEach(() => cy.visit('/account/parking-lots/add'))
    after(() => cy.clearAll())

    it('should allows users to see the list of available hikes', () => {
        cy.fixture('parking-lot').then(json => {
            cy.findByLabelText(/name/i).type(json.parkingLotName)
            cy.findByLabelText(/capacity/i).type(json.capacity)
            cy.findByLabelText(/altitude/i).type(json.altitude)
            cy.get("div.leaflet-container").click({ force: true })

            cy.findByRole('button', { name: /create new parking lot/i }).click()
            cy.get(TOAST_SUCCESS_NOTIFICATION).should('contain.text', `Parking Lot ${json.parkingLotName} has been correctly added`);
        })
    })
})