import { SERVER_URL, TOAST_ERROR_NOTIFICATION, TOAST_SUCCESS_NOTIFICATION } from '../../fixtures/constants'

describe("Start hike", () => {
    beforeEach(() => {
        cy.fixture('hiker/auth-current-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/auth/current`
            }, (req) => req.reply(json.response.Success)).as('auth-current-xhr')
        })

        cy.fixture('browse-hikes/hike-response').then(json => {
            cy.intercept({
                method: "GET",
                url: `${SERVER_URL}/hikes/1`
            }, (req) => {
                req.reply(json.response.Success)
            }).as('hikes-details-xhr')
        })

        cy.fixture('hiker/started-hike-response').then(json => {
            cy.intercept({
                method: "GET",
                url: `${SERVER_URL}/selectedHikes`
            }, (req) => {
                req.reply(json.response.NotFound)
            }).as('started-hike-xhr')
        })


    })

    it('should alert the user for a generic error', () => {
        cy.fixture('hiker/start-hike-response').then(json => {
            cy.intercept({
                method: "POST",
                url: `${SERVER_URL}/selectedHikes/start`
            }, (req) => {
                req.reply(json.response.InternalServerError)
            }).as('start-hike-xhr')
        })

        cy.visit('/hikes/1')

        cy.wait('@started-hike-xhr').then(() => {
            const startHikeBtn = cy.findByRole('button', { name: /start this hike/i });

            startHikeBtn.should('be.visible');
            startHikeBtn.click({ force: true })

            cy.wait('@start-hike-xhr').then((xhr) => {
                cy.get(TOAST_ERROR_NOTIFICATION).should('contain.text', xhr.response.body.error);
            })
        })
    })

    it('should alert the user for an error on started time', () => {
        cy.visit('/hikes/1')

        cy.wait('@started-hike-xhr').then(() => {
            const startHikeBtn = cy.findByRole('button', { name: /start this hike/i });
            startHikeBtn.should('be.visible');

            cy.get('[name="day"]').type(new Date().getDate() + 1, { force: true })

            startHikeBtn.click({ force: true })
            cy.get(TOAST_ERROR_NOTIFICATION).should('contain.text', "Start time cannot be in the future!");
        })

    })

    it('should start hike', () => {
        cy.fixture('hiker/start-hike-response').then(json => {
            cy.intercept({
                method: "POST",
                url: `${SERVER_URL}/selectedHikes/start`
            }, (req) => {
                req.reply(json.response.Success)
            }).as('start-hike-xhr')
        })

        cy.visit('/hikes/1')

        cy.wait('@started-hike-xhr').then(() => {
            const startHikeBtn = cy.findByRole('button', { name: /start this hike/i });

            startHikeBtn.should('be.visible');
            startHikeBtn.click({ force: true })

            cy.wait('@start-hike-xhr').then(() => {
                cy.get(TOAST_SUCCESS_NOTIFICATION).should('contain.text', "Hike correctly started");
            })
        })
    })
})