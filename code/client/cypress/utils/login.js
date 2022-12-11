import { USERNAME_PLACEHOLDER, PASSWORD_PLACEHOLDER, LOGIN_BUTTON } from "../fixtures/authentication/constants"

module.exports = {
    fillFormAndSubmit: ({ userWithDetails } = { userWithDetails: false }) => {
        cy.fixture('user').then((json) => {
            const user = userWithDetails ? json.withDetails : json.base

            /* Fill out the login form and submit it  */
            cy.findByPlaceholderText(USERNAME_PLACEHOLDER).type(user.email)
            cy.findByPlaceholderText(PASSWORD_PLACEHOLDER).type(user.password)
            cy.findByRole('button', { name: LOGIN_BUTTON }).click()
        })
    }
}