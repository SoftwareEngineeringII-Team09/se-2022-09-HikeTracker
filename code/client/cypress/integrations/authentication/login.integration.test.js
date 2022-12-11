import { SERVER_URL, CLIENT_URL, NETWORK_ERROR_MESSAGE, TOAST_ERROR_NOTIFICATION, TOAST_SUCCESS_NOTIFICATION } from '../../fixtures/constants'

import { fillFormAndSubmit } from '../../utils/login'

describe("Login", () => {
    beforeEach(() => {
        cy.visit('/login');
    })

    it("should alert the user that the credentials are wrong", () => {
        cy.fixture('authentication/login-response').then(json => {
            cy.intercept({
                method: "POST",
                url: `${SERVER_URL}/auth/login/password`
            }, (req) => {
                req.reply(json.response.NotFound)
            }).as('auth-xhr')
        })

        fillFormAndSubmit()

        cy.wait('@auth-xhr').then((xhr) => {
            /* Check error toast is shown */
            cy.get(TOAST_ERROR_NOTIFICATION).should('have.text', xhr.response.body.error);
        })
    })

    it("should alert the user for a validation error", () => {
        cy.fixture('authentication/login-response').then(json => {
            cy.intercept({
                method: "POST",
                url: `${SERVER_URL}/auth/login/password`
            }, (req) => {
                req.reply(json.response.UnprocessableEntity)
            }).as('auth-xhr')
        })

        fillFormAndSubmit()

        cy.wait('@auth-xhr').then((xhr) => {
            /* Check error toast is shown */
            cy.get(TOAST_ERROR_NOTIFICATION).should('have.text', xhr.response.body.error);
        })
    })

    it("should alert the user for a generic error", () => {
        cy.fixture('authentication/login-response').then(json => {
            cy.intercept({
                method: "POST",
                url: `${SERVER_URL}/auth/login/password`
            }, (req) => {
                req.reply(json.response.GenericError)
            }).as('auth-xhr')
        })

        fillFormAndSubmit()

        cy.wait('@auth-xhr').then((xhr) => {
            /* Check error toast is shown */
            cy.get(TOAST_ERROR_NOTIFICATION).should('have.text', xhr.response.body.error);
        })
    })

    it("should alert for a network error when server is down", () => {
        cy.intercept({
            method: "POST",
            url: `${SERVER_URL}/auth/login/password`
        }, { forceNetworkError: true, }
        ).as('auth-xhr')

        fillFormAndSubmit()

        cy.wait('@auth-xhr').then((xhr) => {
            /* Check error toast is shown */
            console.log(xhr)
            cy.get(TOAST_ERROR_NOTIFICATION).should('have.text', NETWORK_ERROR_MESSAGE);
        })
    })

    it("should work with the right credentials (user with details)", () => {
        cy.fixture('authentication/login-response').then(json => {
            cy.intercept({
                method: "POST",
                url: `${SERVER_URL}/auth/login/password`
            }, (req) => {
                req.reply(json.response.SuccessWithDetails)
            }).as('auth-xhr')
        })

        fillFormAndSubmit({ userWithDetails: true })

        cy.wait('@auth-xhr').then((xhr) => {
            /* Check error toast is shown */
            cy.get(TOAST_SUCCESS_NOTIFICATION).should('have.text', `Welcome, ${xhr.response.body.firstname}!`);
            cy.url().should('eq', `${CLIENT_URL}`);
        })
    })

    it("should work with the right credentials (hiker)", () => {
        cy.fixture('authentication/login-response').then(json => {
            cy.intercept({
                method: "POST",
                url: `${SERVER_URL}/auth/login/password`
            }, (req) => {
                req.reply(json.response.SuccessHiker)
            }).as('auth-xhr')
        })

        fillFormAndSubmit()

        cy.wait('@auth-xhr').then((xhr) => {
            /* Check error toast is shown */
            cy.get(TOAST_SUCCESS_NOTIFICATION).should('have.text', `Welcome, Hiker!`);
            cy.url().should('eq', `${CLIENT_URL}`);
        })
    })
})