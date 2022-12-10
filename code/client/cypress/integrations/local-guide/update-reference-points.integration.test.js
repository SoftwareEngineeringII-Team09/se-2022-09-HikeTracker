import { SERVER_URL, CLIENT_URL, TOAST_ERROR_NOTIFICATION, TOAST_SUCCESS_NOTIFICATION } from '../../fixtures/constants'


describe('Update reference points (Not authenticated)', () => {
    beforeEach(() => {
        cy.fixture('local-guide/auth-current-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/auth/current`
            }, (req) => req.reply(json.response.Unauthorized)).as('auth-current-xhr')
        })
    })

    it('should aler the user for a auth error and redirect to /login', () => {
        cy.visit('/account/hikes/1/update/reference-points')
        cy.wait('@auth-current-xhr').then(() => cy.url().should('contain', '/login'))
    })
})

describe('Update reference points (Authenticated but Unauthorized)', () => {
    beforeEach(() => {
        cy.fixture('local-guide/auth-current-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/auth/current`
            }, (req) => req.reply(json.response.Success)).as('auth-current-xhr')
        })
    })

    it('should aler the user for a unauthorized error and redirect to /account/hikes', () => {
        // Logged in Local Guide has id equal to 1, so he can not update hikes created by
        // Local Guide with id 2
        cy.intercept({
            method: 'GET',
            url: `${SERVER_URL}/hikes/1`
        }, (req) => req.reply({ statusCode: 200, body: { writer: { writerId: 2 } } })).as('hike-details-xhr')

        cy.intercept({
            method: 'GET',
            url: `${SERVER_URL}/hikes/writers/1`
        }, (req) => req.reply({ statusCode: 200, body: [] })).as('hikes-xhr')

        cy.visit('/account/hikes/1/update/reference-points')
        cy.wait('@hike-details-xhr').then(() => {
            cy.get(TOAST_ERROR_NOTIFICATION).should('contain.text', "Unauthorized operation");
            cy.url().should('eq', `${CLIENT_URL}account/hikes`)
        })
    })
})




describe('Update reference points', () => {

    beforeEach(() => {
        cy.fixture('local-guide/auth-current-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/auth/current`
            }, (req) => req.reply(json.response.Success)).as('auth-current-xhr')
        })
    })

    it('should aler the user for a generic error', () => {
        cy.fixture('browse-hikes/hike-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/hikes/1`
            }, (req) => req.reply(json.response.InternalServerError))
        }).as('hike-details-xhr')

        cy.visit('/account/hikes/1/update/reference-points')

        cy.wait('@hike-details-xhr').then((xhr) => {
            /* Check error toast is shown */
            cy.get(TOAST_ERROR_NOTIFICATION).should('contain.text', xhr.response.body.error);
            cy.findByText(/something went wrong/i).should('be.visible');
        })
    })

    it('should aler the user for a not found error', () => {
        cy.fixture('browse-hikes/hike-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/hikes/1`
            }, (req) => req.reply(json.response.NotFound))
        }).as('hike-details-xhr')

        cy.visit('/account/hikes/1/update/reference-points')

        cy.wait('@hike-details-xhr').then((xhr) => {
            /* Check error toast is shown */
            cy.get(TOAST_ERROR_NOTIFICATION).should('contain.text', xhr.response.body.error);
            cy.findByText(/something went wrong/i).should('be.visible');
        })
    })

    it('should aler the user for a validation error', () => {
        cy.fixture('browse-hikes/hike-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/hikes/1`
            }, (req) => req.reply(json.response.UnprocessableEntity))
        }).as('hike-details-xhr')

        cy.visit('/account/hikes/1/update/reference-points')

        cy.wait('@hike-details-xhr').then((xhr) => {
            /* Check error toast is shown */
            cy.get(TOAST_ERROR_NOTIFICATION).should('contain.text', xhr.response.body.error);
            cy.findByText(/something went wrong/i).should('be.visible');
        })
    })

    it('should show the update reference points feature for that hike', () => {
        cy.fixture('browse-hikes/hike-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/hikes/1`
            }, (req) => req.reply(json.response.Success))
        }).as('hike-details-xhr')

        cy.visit('/account/hikes/1/update/reference-points')

        cy.wait('@hike-details-xhr').then(() => {
            cy.findByText(/Add new reference points/).should('be.visible');
        })
    })

    it('should alert the local guide for an error during save changes', () => {
        cy.fixture('browse-hikes/hike-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/hikes/1`
            }, (req) => req.reply(json.response.Success))
        }).as('hike-details-xhr')

        cy.fixture('local-guide/update-reference-points').then(json => {
            cy.intercept({
                method: 'PUT',
                url: `${SERVER_URL}/hikes/1/refPoints`
            }, (req) => req.reply(json.response.InternalServerError))
        }).as('update-reference-points-xhr')

        cy.visit('/account/hikes/1/update/reference-points')

        cy.wait('@hike-details-xhr').then(() => {
            cy.findByRole('button', { name: /save changes/i }).click()
            cy.wait('@update-reference-points-xhr').then((xhr) => {
                cy.get(TOAST_ERROR_NOTIFICATION).should('contain.text', xhr.response.body.error);
            })
        })
    })

    it('should allow the local guide to update reference points for that hike', () => {
        cy.fixture('browse-hikes/hike-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/hikes/1`
            }, (req) => req.reply(json.response.Success))
        }).as('hike-details-xhr')

        cy.fixture('local-guide/update-reference-points').then(json => {
            cy.intercept({
                method: 'PUT',
                url: `${SERVER_URL}/hikes/1/refPoints`
            }, (req) => req.reply(json.response.Success))
        }).as('update-reference-points-xhr')

        cy.visit('/account/hikes/1/update/reference-points')

        cy.wait('@hike-details-xhr').then(() => {
            cy.findByRole('button', { name: /save changes/i }).click()
            cy.wait('@update-reference-points-xhr').then(() => {
                cy.get(TOAST_SUCCESS_NOTIFICATION).should('contain.text', "Reference points have been correctly updated");
                cy.url().should('eq', `${CLIENT_URL}hikes/1`)
            })
        })
    })
})