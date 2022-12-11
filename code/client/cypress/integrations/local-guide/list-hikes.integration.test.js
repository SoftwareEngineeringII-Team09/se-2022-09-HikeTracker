import { SERVER_URL, TOAST_ERROR_NOTIFICATION, } from '../../fixtures/constants'

describe('List hikes for a Local Guide (Not authenticated)', () => {
    beforeEach(() => {
        cy.fixture('local-guide/auth-current-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/auth/current`
            }, (req) => req.reply(json.response.Unauthorized)).as('auth-current-xhr')
        })
    })

    it('should aler the user for a auth error and redirect to /login', () => {
        cy.visit('/account/hikes')
        cy.wait('@auth-current-xhr').then(() => cy.url().should('contain', '/login'))
    })
})

describe('List hikes for a Local Guide (Authenticated)', () => {

    beforeEach(() => {
        cy.fixture('local-guide/auth-current-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/auth/current`
            }, (req) => req.reply(json.response.Success)).as('auth-current-xhr')
        })
    })

    it('should aler the user for a generic error', () => {
        cy.fixture('browse-hikes/browse-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/hikes/writers/1`
            }, (req) => req.reply(json.response.InternalServerError))
        }).as('browse-hikes-xhr')

        cy.visit('/account/hikes')

        cy.wait('@browse-hikes-xhr').then((xhr) => {
            /* Check error toast is shown */
            cy.get(TOAST_ERROR_NOTIFICATION).should('contain.text', xhr.response.body.error);
            cy.findByText(/no hikes here/i).should('be.visible');
        })
    })

    it('should shows that there are no hikes', () => {
        cy.fixture('browse-hikes/browse-response').then(json => {
            cy.intercept({
                method: "GET",
                url: `${SERVER_URL}/hikes/writers/1`
            }, (req) => {
                req.reply(json.response.SuccessEmpty)
            }).as('browse-hikes-xhr')
        })

        cy.visit('/account/hikes')

        cy.wait('@browse-hikes-xhr').then((xhr) => {
            cy.get(xhr.response.body).should('have.length', 0);
            cy.findByText(/No hikes here.../i).should('be.visible');
        })
    })

    it('should shows list of available hikes', () => {
        cy.fixture('browse-hikes/browse-response').then(json => {
            cy.intercept({
                method: "GET",
                url: `${SERVER_URL}/hikes/writers/1`
            }, (req) => {
                req.reply(json.response.Success)
            }).as('browse-hikes-xhr')
        })

        cy.visit('/account/hikes')

        cy.wait('@browse-hikes-xhr').then((xhr) => {
            cy.findByText(xhr.response.body[0].title).should('be.visible');
        })
    })

})