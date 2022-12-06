
import { CLIENT_URL } from "../../src/services/config";

describe('Create new hike', () => {

  before(() => {
    // Reset the database prior to every test
    cy.clearAll()
    // Create Local Guide user
    cy.addLocalGuide()
    // Login as Local Guide
    cy.loginLocalGuide();
    // Create a hike
    cy.fixture('../fixtures/gpxTestTrack.gpx').then((gpx) => {
      cy.addHike({
        title: "Test Hike",
        region: 1,
        province: 2,
        city: 3,
        expTime: "2:30",
        difficulty: "Hiker",
        description: "Test description",
        gpx: new File([gpx], "gpxTestTrack.gpx")
      });
    });
    // Create parking lot clost to start point
    cy.addParkingLot({
      parkingLotName: "Test Parking Lot",
      latitude: 45.17,
      longitude: 7.085
    });
    // Create Hut close to end point
    cy.addHut({
      hutName: "Test Hut",
      city: 1,
      province: 1,
      region: 1,
      numOfBeds: 10,
      cost: 60.00,
      altitude: 1000,
      latitude: 45.19,
      longitude: 7.75
    });
  })

  beforeEach(() => {
    // Intercept the request to the server
    cy.server()
  });

  it('Updates hike start/end points', () => {

    const hikeId = 1;
    cy.loginLocalGuide();

    // Intercept the requests to the server

    cy.route({
      method: 'GET',
      url: `**/potentialStartEndPoints`,
    }).as('get-potential-endpoints');

    cy.route({
      method: 'PUT',
      url: `**/startEndPoints`,
    }).as('hike-update-endpoints');

    /* Navigate to start/end point update page */
    cy.visit(`/browse/${hikeId}`);

    // Click on start point marker
    cy.get('img[alt="Start marker"]').click({ force: true });

    // Check popup is shown
    cy.get('.leaflet-popup').should('have.css', 'opacity', '1');

    // Click on "Update start point" link
    cy.get('a').contains("Update Start Point").click({ force: true });

    cy.url().should('eq', `${CLIENT_URL}hikes/${hikeId}/update-endpoints`);

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


      /*  SET END POINT */

      // Click on a potential end point
      cy.get('img[alt="Marker"]:nth-of-type(3)').first().click({ force: true });

      // Check update popup is shown
      cy.get('.leaflet-popup').should('have.css', 'opacity', '1');

      // Click on "Set as end point" button
      cy.get('button').contains("Set as end point").focus().click({ force: true });


      // Submit endpoints update
      cy.get('button').contains("Save points").click();

      expect(cy.get('img[alt="Start marker"]')).to.not.equal(oldStartPoint);

      // Wait for start point update
      cy.wait('@hike-update-endpoints').then((xhr) => {

        expect(xhr.request.body).equal({
          newStartPoint: {
            type: "hut",
            id: 1
          },
          newEndPoint: {
            type: "parkingLot",
            id: 1
          }
        });
        expect(xhr.status).to.equal(200);

        // Check success message is shown
        cy.get('.Toastify__toast--success').contains('Points have been successfully updated').should('be.visible');

      });

    });

  });

});