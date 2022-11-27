import { CLIENT_URL } from "../../src/services/config";

describe('Login', () => {

  before(() => {
    // Reset and seed the database prior to every test
    cy.clearAll();
  });

  it('Shows error to non existing user', () => {
    cy.visit('/login');

    const username = 'non@existing.user';
    const password = 'password';

    /* Fill out the login form and submit it  */
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    /* Check error toast is shown */
    cy.get('.Toastify__toast--error').should('be.visible');
    
  });

  it('Redirects user upon successful signup', () => {

    cy.addLocalGuide();
    cy.visit('/login');

    const username = 'testLocalGuide@email.com';
    const password = 'Password1234.';

    /* Fill out the login form and submit it  */
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    /* Check user is redirected to homepage */
    cy.url().should('eq', `${CLIENT_URL}`);

    /* Check session cookie has been set */
    cy.getCookie('connect.sid').should('exist')
  });
});