import { SERVER_URL, CLIENT_URL, TOAST_ERROR_NOTIFICATION, TOAST_SUCCESS_NOTIFICATION } from '../../fixtures/constants'

describe('Create parking lot (Not authenticated)', () => {
    beforeEach(() => {
        cy.fixture('local-guide/auth-current-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/auth/current`
            }, (req) => req.reply(json.response.Unauthorized)).as('auth-current-xhr')
        })
    })

    it('should aler the user for a auth error and redirect to /login', () => {
        cy.visit('/account/parking-lots/add')
        cy.wait('@auth-current-xhr').then(() => cy.url().should('contain', '/login'))
    })
})

describe('Create parking lot', () => {

    beforeEach(() => {
        cy.fixture('local-guide/auth-current-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/auth/current`
            }, (req) => req.reply(json.response.Success)).as('auth-current-xhr')
        })
    })

    it('should show validation error if no name', () => {
        cy.viewport(1200, 1200)

        cy.visit('/account/parking-lots/add')

        cy.findByLabelText("Name").focus()
        cy.findByLabelText("Capacity").type("100")
        cy.findByLabelText("Altitude").type("600")
        cy.get("div.leaflet-container").click({ force: true })

        cy.findByRole('button', { name: /create new parking lot/i }).should('be.disabled')
        cy.findByText(/you must insert a name/i).should('be.visible')
    })

    it('should show validation error if no capacity', () => {
        cy.viewport(1200, 1200)

        cy.visit('/account/parking-lots/add')

        cy.findByLabelText("Name").type("Only good cars")
        cy.findByLabelText("Capacity").focus()
        cy.findByLabelText("Altitude").type("600")
        cy.get("div.leaflet-container").click({ force: true })

        cy.findByRole('button', { name: /create new parking lot/i }).should('be.disabled')
        cy.findByText(/Capacity must be a number/i).should('be.visible')
    })

    it('should show validation error if capacity is wrong', () => {
        cy.viewport(1200, 1200)

        cy.visit('/account/parking-lots/add')

        cy.findByLabelText("Name").type("Only good cars")
        cy.findByLabelText("Capacity").type("one hundred")
        cy.findByLabelText("Altitude").type("600")
        cy.get("div.leaflet-container").click({ force: true })

        cy.findByRole('button', { name: /create new parking lot/i }).should('be.disabled')
        cy.findByText(/Capacity must be a number/i).should('be.visible')
    })

    it('should disable submit button if no coords', () => {
        cy.viewport(1200, 1200)

        cy.visit('/account/parking-lots/add')

        cy.findByLabelText("Name").type("Only good cars")
        cy.findByLabelText("Capacity").type("100")
        cy.findByLabelText("Altitude").type("600")

        cy.findByRole('button', { name: /create new parking lot/i }).should('be.disabled')
    })

    it('should alert local guide for a generic error', () => {
        cy.viewport(1200, 1200)

        cy.fixture('local-guide/add-parking-lot').then(json => {
            cy.intercept({
                method: 'POST',
                url: `${SERVER_URL}/parkingLots`
            }, (req) => req.reply(json.response.InternalServerError)).as('add-parking-lot-xhr')
        })

        cy.visit('/account/parking-lots/add')

        cy.findByLabelText("Name").type("Only good cars")
        cy.findByLabelText("Capacity").type("100")
        cy.findByLabelText("Altitude").type("600")
        cy.get("div.leaflet-container").click({ force: true })

        cy.findByRole('button', { name: /create new parking lot/i }).click()

        cy.wait('@add-parking-lot-xhr').then((xhr) => {
            cy.get(TOAST_ERROR_NOTIFICATION).should('contain.text', xhr.response.body.error);
        })
    })

    it('should allow local guide to create new parking lot', () => {
        cy.viewport(1200, 1200)

        cy.fixture('local-guide/add-parking-lot').then(json => {
            cy.intercept({
                method: 'POST',
                url: `${SERVER_URL}/parkingLots`
            }, (req) => req.reply(json.response.Success)).as('add-parking-lot-xhr')
        })

        cy.visit('/account/parking-lots/add')

        cy.findByLabelText("Name").type("Only good cars")
        cy.findByLabelText("Capacity").type("100")
        cy.findByLabelText("Altitude").type("600")
        cy.get("div.leaflet-container").click({ force: true })

        cy.findByRole('button', { name: /create new parking lot/i }).click()

        cy.wait('@add-parking-lot-xhr').then(() => {
            cy.get(TOAST_SUCCESS_NOTIFICATION).should('contain.text', "has been correctly added");
            cy.url().should('eq', `${CLIENT_URL}`)
        })
    })
})