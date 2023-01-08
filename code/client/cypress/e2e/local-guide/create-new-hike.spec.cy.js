const { CLIENT_URL, TOAST_SUCCESS_NOTIFICATION } = require("../../fixtures/constants");

describe('Create new hike', () => {

  before(() => {
    cy.clearAll()
    cy.createUserWithDetails({ role: "Local Guide" })
    cy.loginAsLocalGuide()

    cy.viewport(1200, 1200)
  })

  it('Creates a new hike', () => {

    cy.visit('/account/hikes/add', { headers: { "Accept-Encoding": "gzip, deflate" } });

    /* Fill out the login form and submit it  */
    const hikeTitle = "Hike title";

    const hikeRegion = "Piemonte";
    const hikeProvince = "Torino";
    const hikeCity = "Mompantero";
    const hikeExpectedTime = "02:30";
    const hikeDifficulty = "Tourist";
    const hikeDescription = "Test description";
    const gpxTestTrack = "../fixtures/tracks/gpxTestTrack.gpx";
    const coverImage = "../fixtures/images/cover.jpeg";

    cy.get('input[id="title"]').type(hikeTitle);
    cy.get('select[id="region"]').select(hikeRegion);
    cy.get('select[id="province"]').select(hikeProvince);
    cy.get('select[id="city"]').select(hikeCity);
    cy.get('input[id="expectedTime"]').type(hikeExpectedTime);
    cy.get('select[id="difficulty"]').select(hikeDifficulty);
    cy.get('textarea[id="description"]').type(hikeDescription);
    cy.get('input[id="gpx"]').attachFile(gpxTestTrack);
    cy.get('input[id="image"]').attachFile(coverImage);
    cy.get('button[type="submit"]').click();

    cy.get(TOAST_SUCCESS_NOTIFICATION).should('contain.text', `Hike created successfully`);
    cy.url().should('eq', `${CLIENT_URL}account/hikes/1/update/reference-points`);

  });

});