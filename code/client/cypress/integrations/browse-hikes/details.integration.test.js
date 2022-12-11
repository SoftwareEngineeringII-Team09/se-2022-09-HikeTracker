import { SERVER_URL, TOAST_ERROR_NOTIFICATION, } from '../../fixtures/constants'

describe("Hike details", () => {
    it('should alert the user for a generic error', () => {
        cy.fixture('browse-hikes/hike-response').then(json => {
            cy.intercept({
                method: "GET",
                url: `${SERVER_URL}/hikes/1`
            }, (req) => {
                req.reply(json.response.InternalServerError)
            }).as('hikes-details-xhr')
        })

        cy.visit('/hikes/1')
        
        cy.wait('@hikes-details-xhr').then((xhr) => {
            /* Check error toast is shown */
            cy.get(TOAST_ERROR_NOTIFICATION).should('contain.text', xhr.response.body.error);
            cy.findByText(/Something went wrong/i).should('be.visible');
        })
    })
    
    it('should alert the user that hike is not found', () => {
        cy.fixture('browse-hikes/hike-response').then(json => {
            cy.intercept({
                method: "GET",
                url: `${SERVER_URL}/hikes/1`
            }, (req) => {
                req.reply(json.response.NotFound)
            }).as('hikes-details-xhr')
        })

        cy.visit('/hikes/1')
        
        cy.wait('@hikes-details-xhr').then((xhr) => {
            /* Check error toast is shown */
            cy.get(TOAST_ERROR_NOTIFICATION).should('contain.text', xhr.response.body.error);
            cy.findByText(/Something went wrong/i).should('be.visible');
        })
    })

    it('should alert the user for a validation error', () => {
        cy.fixture('browse-hikes/hike-response').then(json => {
            cy.intercept({
                method: "GET",
                url: `${SERVER_URL}/hikes/1`
            }, (req) => {
                req.reply(json.response.UnprocessableEntity)
            }).as('hikes-details-xhr')
        })

        cy.visit('/hikes/1')
        
        cy.wait('@hikes-details-xhr').then((xhr) => {
            /* Check error toast is shown */
            cy.get(TOAST_ERROR_NOTIFICATION).should('contain.text', xhr.response.body.error);
            cy.findByText(/Something went wrong/i).should('be.visible');
        })
    })

    it('should show hike details', () => {
        cy.fixture('browse-hikes/hike-response').then(json => {
            cy.intercept({
                method: "GET",
                url: `${SERVER_URL}/hikes/1`
            }, (req) => {
                req.reply(json.response.Success)
            }).as('hikes-details-xhr')
        })

        cy.visit('/hikes/1')
        
        cy.wait('@hikes-details-xhr').then((xhr) => {
            /* Check error toast is shown */
            cy.findByText(xhr.response.body.title).should('be.visible');
        })
    })
})