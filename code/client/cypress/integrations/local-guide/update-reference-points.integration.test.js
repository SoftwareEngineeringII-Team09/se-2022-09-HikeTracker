import { SERVER_URL, TOAST_ERROR_NOTIFICATION, } from '../../fixtures/constants'


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

describe('Update reference points (Authenticated but not Unauthorized)', () => {
    beforeEach(() => {
        cy.fixture('local-guide/auth-current-response').then(json => {
            cy.intercept({
                method: 'GET',
                url: `${SERVER_URL}/auth/current`
            }, (req) => req.reply(json.response.Success)).as('auth-current-xhr')
        })
    })

    it('should aler the user for a unauthorized error and redirect to /account/hikes', () => {
        cy.intercept({
            method: 'GET',
            url: `${SERVER_URL}/hikes/1`
        }, (req) => req.reply({ statusCode: 200, body: { writer: { writerId: 2 } } })).as('hike-details-xhr')

        cy.visit('/account/hikes/1/update/reference-points')
        cy.wait('@hike-details-xhr').then(() => cy.url().should('eq', '/account/hikes'))
    })
})




// beforeEach(() => {
//     cy.intercept({
//         method: 'GET',
//         url: `${SERVER_URL}/auth/current`
//     }, (req) => req.reply({ statusCode: 200, body: { role: 'Local Guide', userId: 1 } }))
// })

// describe('Update reference points', () => {
//     it('should aler the user for a generic error', () => {
//         cy.fixture('browse-hikes/hike-response').then(json => {
//             cy.intercept({
//                 method: 'GET',
//                 url: `${SERVER_URL}/hikes/writers/1`
//             }, (req) => req.reply(json.response.InternalServerError))
//         }).as('hike-details-xhr')

//         cy.visit('/account/hikes')
//     })

// })