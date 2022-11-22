describe('Login', () => {

  beforeEach(() => {
    // Reset and seed the database prior to every test
    // TODO: cy.exec('npm run db:reset && npm run db:seed');
  });

  it('Shows error to non existing user', () => {
    cy.visit('/login');

    const username = 'non@existing.user';
    const password = 'password';

    /* Fill out the login form and submit it  */
    cy.get('input[name="email"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    /* Check error toast is shown */
    cy.get('.Toastify__toast--error').should('be.visible');
    
  });

  it('Shows error to non existing user', () => {
    cy.visit('/login');

    const username = 'test@email.com';
    const password = 'password';

    /* Fill out the login form and submit it  */
    cy.get('input[name="email"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    /* Check user is redirected to homepage */
    // TODO: cy.url().should('eq', '/');

    /* Check session cookie has been set */
    // TODO: cy.getCookie('your-session-cookie').should('exist')
  });
});