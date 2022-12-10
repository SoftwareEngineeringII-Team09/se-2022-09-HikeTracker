describe('Create new hut', () => {

  before(() => {
    // Reset the database prior to every test
    cy.clearAll()
    // Create Local Guide user
    cy.addLocalGuide()
  })

  beforeEach(() => {
    // Intercept the request to the server
    cy.server()
  });

  it('Creates a new hut', () => {

    cy.loginLocalGuide();

    cy.route({
      method: 'POST',
      url: `**/huts`,
    }).as('hut-creation-request')

    cy.visit('/huts/add');

    const hutName = "Hut Name";

    const hutRegion = "Piemonte";
    const hutProvince = "Torino";
    const hutCity = "Torino";
    const hutAltitude = 3000;
    const hutNumOfBeds = 30;
    const hutPhone = "3334455666";
    const hutEmail = "hut@email.com";

    cy.get('input[id="hutName"]').type(hutName);
    cy.get('select[id="region"]').select(hutRegion);
    cy.get('select[id="province"]').select(hutProvince);
    cy.get('select[id="city"]').select(hutCity);
    cy.get('canvas').trigger('pointerdown', {clientX: 900, clientY: 500});
    cy.get('canvas').trigger('pointerup', {clientX: 900,clientY: 500});
    cy.get('input[id="altitude"]').type(hutAltitude);
    cy.get('select[id="numOfBeds"]').type(hutNumOfBeds);
    cy.get('input[id="phone"]').type(hutPhone);
    cy.get('input[id="email"]').type(hutEmail);
    cy.get('button[type="submit"]').click();

    cy.wait('@hut-creation-request').then((request) => {
      expect(request.status).to.equal(201)
    });

  });

});