
import { CLIENT_URL } from "../../src/services/config";

describe('Create new hike', () => {

  let firstLatitude, firstLongitude, lastLatitude, lastLongitude;

  before(() => {
    // Reset the database prior to every test
    cy.clearAll();
    // Create Local Guide user
    cy.addLocalGuide();
    // Login as Local Guide
    cy.loginLocalGuide();
    // Create a hike
    cy.fixture('../fixtures/tracks/gpxTestTrack.gpx').then((gpx) => {
      cy.fixture('../fixtures/hikes/hike1.json').then((hike) => {
        hike.gpx = new File([gpx], "gpxTestTrack.gpx");
        cy.addHike(hike);
      });
    });
    // Create parking lot clost to start point
    cy.fixture('../fixtures/parkingLots/parkingLot1.json').then((parkingLot) => {
      cy.addParkingLot(parkingLot);
      firstLatitude = parkingLot.latitude;
      firstLongitude = parkingLot.longitude;
    });
    // Create Hut close to end point
    cy.fixture('../fixtures/huts/hut1.json').then((hut) => {
      cy.addHut(hut);
      lastLatitude = hut.latitude;
      lastLongitude = hut.longitude;
    });
  });

  beforeEach(() => {
    // Intercept the request to the server
    cy.server();
  });

  it('Updates hike start/end points', () => {

    const hikeId = 1;
    cy.loginLocalGuide();

    // Intercept the requests to the server
    cy.route({
      method: 'GET',
      url: `**/hikes/**`,
    }).as('get-hike-details');

    cy.route({
      method: 'GET',
      url: `**/potentialStartEndPoints`,
    }).as('get-potential-endpoints');

    cy.route({
      method: 'PUT',
      url: `**/startEndPoints`,
    }).as('hike-update-endpoints');

    /* Navigate to start/end point update page */
    cy.visit(`/hikes/${hikeId}`);

    // Click on start point marker
    cy.get('img[alt="Start marker"]').click({ force: true });

    // Check popup is shown
    cy.get('.leaflet-popup').should('have.css', 'opacity', '1');

    // Click on "Update start point" link
    cy.get('a').contains("Update Start Point").click({ force: true });

    cy.url().should('eq', `${CLIENT_URL}account/hikes/${hikeId}/update/endpoints`);

    cy.wait('@get-hike-details').then(() => {});

    // Wait for potential endpoints retrieval
    cy.wait('@get-potential-endpoints').then((request) => {
      expect(request.status).to.equal(200);

      const oldStartPoint = cy.get('img[alt="Start marker"]');
      const oldEndPoint = cy.get('img[alt="End marker"]');

      /*  SET START POINT */

      // Click on a potential start point
      cy.get('img[alt="Marker"]').first().click({ force: true });

      // Check update popup is shown
      cy.get('.leaflet-popup').should('have.css', 'opacity', '1');

      // Click on "Set as start point" button
      cy.get('button').contains("Set as start point").focus().click({ force: true });

      // Check UI shows new start point
      cy.contains(`Latitude: ${firstLatitude}`);
      cy.contains(`Longitude: ${firstLongitude}`);

      /*  SET END POINT */

      // Click on a potential end point
      cy.get('img[alt="Marker"]:nth-of-type(2)').first().click({ force: true });

      // Check update popup is shown
      cy.get('.leaflet-popup').should('have.css', 'opacity', '1');

      // Click on "Set as end point" button
      cy.get('button').contains("Set as end point").focus().click({ force: true });

      // Check UI shows new start point
      cy.contains(`Latitude: ${lastLatitude}`);
      cy.contains(`Longitude: ${lastLongitude}`);

      cy.wait('@get-hike-details').then(() => {});

      // Submit endpoints update
      cy.get('button').contains("Save points").click();

      // verify markes are updated
      expect(cy.get('img[alt="Start marker"]')).to.not.equal(oldStartPoint);
      expect(cy.get('img[alt="End marker"]')).to.not.equal(oldEndPoint);

      // Wait for start point update
      cy.wait('@hike-update-endpoints').then((xhr) => {

        const expectedBody = {
          newStartPoint: { type: 'parking lot', id: 1 },
          newEndPoint: { type: 'hut', id: 1 }
        };

        Object.keys(expectedBody).forEach(key => {
          expect(expectedBody[key]).to.deep.eq(xhr.request.body[key]);
        });
        
        expect(Object.keys(expectedBody).length).to.eq(Object.keys(xhr.request.body).length);

        expect(xhr.status).to.equal(201);

        // Check success message is shown
        cy.get('.Toastify__toast--success').contains('Points have been successfully updated').should('be.visible');

        // Check the new updated is retrieved from the server
        cy.wait('@get-hike-details').then((request) => {
          expect(request.status).to.equal(200);
        });

      });

    });

  });

});