describe('Signup', () => {
  before(() => cy.clearAll())
  beforeEach(() => cy.visit('/signup'))
  after(() => cy.clearAll())

  it('Correctly register a new user', () => {

    const email = "email@example.com";
    const password = "Secure!p4ssw0rd";
    const mobile = "+39 3921234567";
    const role = "Local Guide";
    const firstname = "John";
    const lastname = "Doe";

    /* Fill out the signup form and submit it  */
    cy.get('select[name="role"]').select(role);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirmPassword"]').type(password);
    cy.get('input[name="firstname"]').type(firstname);
    cy.get('input[name="lastname"]').type(lastname);
    cy.get('input[name="mobile"]').type(mobile);
    cy.get('button[type="submit"]').click();

    /* Check success alert is shown */
    cy.contains('Welcome!')

  });
});