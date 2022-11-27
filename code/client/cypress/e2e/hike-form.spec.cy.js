const gpxTestTrack = require("@data/test/gpxTestTrack.gpx");

describe('Login', () => {

  beforeEach(() => {
    // Reset and seed the database prior to every test
    // TODO: cy.exec('npm run db:reset && npm run db:seed');
  });

  it('Creates a new hike', () => {

    // cy.loginLocalGuide();

    cy.visit('/hikes/add');

    /* Fill out the login form and submit it  */
    const hikeTitle = "Hike title";
    const hikeProvince = "TORINO";
    const hikeCity = "ALMESE";
    const hikeExpectedTime = "02,30";
    const hikeDifficulty = "Tourist";
    const hikeDescription = "Test description";

    cy.get('input[id="title"]').type(hikeTitle);
    cy.get('input[id="province"]').type(hikeProvince);
    cy.get('input[id="city"]').type(hikeCity);
    cy.get('input[id="expTime"]').type(hikeExpectedTime);
    cy.get('input[id="difficulty"]').type(hikeDifficulty);
    cy.get('input[id="description"]').type(hikeDescription);
    cy.get('input[id="gpxFile"]').type(gpxTestTrack);
    cy.get('button[type="submit"]').click();

    /* Check error toast is shown */
    cy.get('.Toastify__toast--success').should('be.visible');

  });

});