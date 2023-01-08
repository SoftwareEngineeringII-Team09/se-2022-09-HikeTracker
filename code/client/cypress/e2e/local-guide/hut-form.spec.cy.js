import { TOAST_SUCCESS_NOTIFICATION } from '../../fixtures/constants'

const coverImage = "../fixtures/images/test.jpeg";

describe('Create new hut', () => {

  before(() => {
    cy.clearAll()
    cy.createUserWithDetails({ role: "Local Guide" })
    cy.loginAsLocalGuide()
    cy.viewport(1200, 1200)
  })

  beforeEach(() => cy.visit('/account/huts/add'))
  after(() => cy.clearAll())

  it('Creates a new hut', () => {
    cy.fixture('hut').then(json => {
      cy.findByLabelText(/name/i).type(json.hutName, { force: true })
      cy.findByLabelText(/region/i).select(json.region, { force: true })
      cy.findByLabelText(/province/i).select(json.province, { force: true })
      cy.findByLabelText(/city/i).select('Torino', { force: true })
      cy.findByLabelText(/altitude/i).type(json.altitude, { force: true })
      cy.findByLabelText(/phone number/i).type(json.phone, { force: true })
      cy.findByLabelText(/number of beds/i).type(json.numOfBeds, { force: true })
      cy.findByLabelText(/email/i).type(json.email, { force: true })
      cy.findByLabelText(/website/i).type(json.website, { force: true })
      cy.get('input[id="hutImage"]').attachFile(coverImage, { force: true });
      cy.get("div.leaflet-container").click({ force: true })

      cy.findByRole('button', { name: /create new hut/i }).click({ force: true })
      cy.get(TOAST_SUCCESS_NOTIFICATION).should('contain.text', `The new hut has been correctly added`);
    })

  });

});