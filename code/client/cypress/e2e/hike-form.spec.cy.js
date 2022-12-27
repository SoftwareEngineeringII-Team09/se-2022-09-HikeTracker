describe('Create new hike', () => {

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

  it('Creates a new hike', () => {

    cy.loginLocalGuide();

    cy.route({
      method: 'POST',
      url: `**/hikes`,
    }).as('hike-creation-request')

    cy.visit('/account/hikes/add', { headers: { "Accept-Encoding": "gzip, deflate" } });

    /* Fill out the login form and submit it  */
    const hikeTitle = "Hike title";

    const hikeRegion = "Piemonte";
    const hikeProvince = "Torino";
    const hikeCity = "Maglione";
    const hikeExpectedTime = "02:30";
    const hikeDifficulty = "Tourist";
    const hikeDescription = "Test description";
    const gpxTestTrack = "../fixtures/tracks/gpxTestTrack.gpx";

    cy.get('input[id="title"]').type(hikeTitle);
    cy.get('select[id="region"]').select(hikeRegion);
    cy.get('select[id="province"]').select(hikeProvince);
    cy.get('select[id="city"]').select(hikeCity);
    cy.get('input[id="expTime"]').type(hikeExpectedTime);
    cy.get('select[id="difficulty"]').type(hikeDifficulty);
    cy.get('input[id="description"]').type(hikeDescription);
    cy.get('input[id="gpxFile"]').attachFile(gpxTestTrack);
    cy.get('button[type="submit"]').click();

    cy.wait('@hike-creation-request').then((request) => {
      expect(request.status).to.equal(201)
    });

    cy.url().should('include', '/reference-points/');

  });

});