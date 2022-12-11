import { SERVER_URL, TOAST_ERROR_NOTIFICATION, } from '../../fixtures/constants'

describe("Browse hikes", () => {
    it('should alert the user for a generic error', () => {
        cy.fixture('browse-hikes/browse-response').then(json => {
            cy.intercept({
                method: "GET",
                url: `${SERVER_URL}/hikes`
            }, (req) => {
                req.reply(json.response.InternalServerError)
            }).as('browse-hikes-xhr')
        })

        cy.visit('/hikes')

        cy.wait('@browse-hikes-xhr').then((xhr) => {
            /* Check error toast is shown */
            cy.get(TOAST_ERROR_NOTIFICATION).should('contain.text', xhr.response.body.error);
            cy.findByText(/No hikes here.../i).should('be.visible');
        })
    })

    it('should shows that there are no hikes', () => {
        cy.fixture('browse-hikes/browse-response').then(json => {
            cy.intercept({
                method: "GET",
                url: `${SERVER_URL}/hikes`
            }, (req) => {
                req.reply(json.response.SuccessEmpty)
            }).as('browse-hikes-xhr')
        })

        cy.visit('/hikes')

        cy.wait('@browse-hikes-xhr').then((xhr) => {
            cy.get(xhr.response.body).should('have.length', 0);
            cy.findByText(/No hikes here.../i).should('be.visible');
        })
    })

    it('should shows list of available hikes', () => {
        cy.fixture('browse-hikes/browse-response').then(json => {
            cy.intercept({
                method: "GET",
                url: `${SERVER_URL}/hikes`
            }, (req) => {
                req.reply(json.response.Success)
            }).as('browse-hikes-xhr')
        })

        cy.visit('/hikes')

        cy.wait('@browse-hikes-xhr').then((xhr) => {
            cy.findByText(xhr.response.body[0].title).should('be.visible');
        })
    })
})