import { TOAST_SUCCESS_NOTIFICATION } from '../../fixtures/constants'

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
      cy.findByLabelText(/name/i).type(json.hutName)
      cy.findByLabelText(/region/i).select(json.region)
      cy.findByLabelText(/province/i).select(json.province)
      //cy.findByLabelText(/city/i).select(json.city)
      cy.findByLabelText(/altitude/i).type(json.altitude)
      cy.findByLabelText(/phone number/i).type(json.phone)
      cy.findByLabelText(/number of beds/i).type(json.numOfBeds)
      cy.findByLabelText(/email/i). type(json.email)
      cy.findByLabelText(/website/i).type(json.website)
      cy.get("div.leaflet-container").click({ force: true })

      cy.findByRole('button', { name: /create new hut/i }).click()
      //cy.get(TOAST_SUCCESS_NOTIFICATION).should('contain.text', `Hut ${json.hutName} has been correctly added`);
  })

  });

});