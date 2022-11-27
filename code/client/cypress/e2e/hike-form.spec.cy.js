<<<<<<< HEAD
const gpxTestTrack = require("@data/test/gpxTestTrack.gpx");

describe('Login', () => {

  beforeEach(() => {
    // Reset and seed the database prior to every test
    // TODO: cy.exec('npm run db:reset && npm run db:seed');
=======
import { SERVER_URL } from "../../src/services/config";

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
>>>>>>> ca401ed28219541a9e2f94c614cef86841ec04bd
  });

  it('Creates a new hike', () => {

<<<<<<< HEAD
    // cy.loginLocalGuide();
=======
    cy.loginLocalGuide();

    cy.route({
      method: 'POST',
      url: `**/hikes`,
    }).as('hike-creation-request')
>>>>>>> ca401ed28219541a9e2f94c614cef86841ec04bd

    cy.visit('/hikes/add');

    /* Fill out the login form and submit it  */
    const hikeTitle = "Hike title";
<<<<<<< HEAD
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
=======
    const hikeRegion = "Piemonte";
    const hikeProvince = "Torino";
    const hikeCity = "Maglione";
    const hikeExpectedTime = "02:30";
    const hikeDifficulty = "Tourist";
    const hikeDescription = "Test description";
    const gpxTestTrack = "../fixtures/gpxTestTrack.gpx";

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
      console.log(request)
      expect(xhr.status).to.equal(201)
    });

    cy.url().should('include', '/browse/');
>>>>>>> ca401ed28219541a9e2f94c614cef86841ec04bd

  });

});