import { CLIENT_URL } from '../../fixtures/constants'

describe('Update hike start/end points', () => {

  before(() => {
    cy.clearAll();
    cy.createUserWithDetails({ role: "Local Guide" })
    cy.createHike({ writer: 1 })
    cy.createHut({ writer: 1 })
    cy.createParkingLot({ writer: 1 })
    cy.loginAsLocalGuide();
  });

  beforeEach(() => cy.visit('/hikes/1'))

  after(() => cy.clearAll())

  const setStartPoint = () => {
    // Click on a potential start point
    cy.get('img[alt="Marker"]').first().click({ force: true });

    // Check update popup is shown
    cy.get('.leaflet-popup').should('have.css', 'opacity', '1');

    // Click on "Set as start point" button
    cy.get('button').contains("Set as start point").focus().click({ force: true });
  }

  const setEndPoint = () => {
    // Click on a potential end point
    cy.get('img[alt="Marker"]:nth-of-type(2)').first().click({ force: true });

    // Check update popup is shown
    cy.get('.leaflet-popup').should('have.css', 'opacity', '1');

    // Click on "Set as end point" button
    cy.get('button').contains("Set as end point").focus().click({ force: true });
  }


  it('Updates hike start/end points', () => {
    // Click on start point marker
    cy.get('img[alt="Start marker"]').click({ force: true });

    // Click on "Update start point" link
    cy.get('a').contains("Update Start Point").click({ force: true });

    cy.url().should('eq', `${CLIENT_URL}account/hikes/1/update/endpoints`);

    const oldStartPoint = cy.get('img[alt="Start marker"]');
    const oldEndPoint = cy.get('img[alt="End marker"]');

    /*  SET START POINT */
    setStartPoint()

    /*  SET END POINT */
    setEndPoint()

    // Submit endpoints update
    cy.get('button').contains("Save points").click();

    // verify markes are updated
    expect(cy.get('img[alt="Start marker"]')).to.not.equal(oldStartPoint);
    expect(cy.get('img[alt="End marker"]')).to.not.equal(oldEndPoint);

    // Check success message is shown
    cy.get('.Toastify__toast--success').contains('Points have been successfully updated').should('be.visible');
    cy.url().should('eq', `${CLIENT_URL}hikes/1`)
    cy.findAllByText(/Rifugio Santa Claus/i).should('be.visible')
    cy.findAllByText(/Only good cars/i).should('be.visible')
  });

});