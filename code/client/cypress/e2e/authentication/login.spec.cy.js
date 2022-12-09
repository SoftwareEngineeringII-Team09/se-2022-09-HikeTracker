import { CLIENT_URL } from '../../fixtures/constants'

import { fillFormAndSubmit } from '../../utils/login'

describe('Login', () => {
  before(() => {
    cy.clearAll();
    cy.createUserWithDetails({ role: "Local Guide" });
  })

  beforeEach(() => {
    cy.visit('/login');
  });

  after(() => {
    // Reset and seed the database prior to every test
    cy.clearAll();
  })

  it('should allows user to perfom login', () => {
    fillFormAndSubmit({ userWithDetails: true })

    /* Check user is redirected to homepage */
    cy.url().should('eq', `${CLIENT_URL}`);

    /* Check session cookie has been set */
    cy.getCookie('connect.sid').should('exist')
  });
});