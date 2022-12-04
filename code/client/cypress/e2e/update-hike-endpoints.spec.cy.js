
import { SERVER_URL } from "../../src/services/config";

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
      // latitude: 45.19,
      // longitude: 7.75
      latitude: 45.17779,
      longitude: 7.08338
    });
  })

  beforeEach(() => {
    // Intercept the request to the server
    cy.server()
  });

  it('Creates a new hike', () => {

    cy.loginLocalGuide();

    cy.route({
      method: 'GET',
      url: `**/potentialStartEndPoints`,
    }).as('hike-potential-endpoints')

    cy.route({
      method: 'PUT',
      url: `**/startEndPoints`,
    }).as('hike-update-endpoints')

    cy.visit('/hikes/1/update-endpoints');

    cy.wait('@hike-update-endpoints').then((request) => {
      expect(request.status).to.equal(201)
    });

    cy.url().should('include', '/browse/');

  });

});