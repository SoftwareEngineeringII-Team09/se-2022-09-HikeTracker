import { SERVER_URL } from '../../fixtures/constants'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

describe('Hike details', () => {
    before(() => {
        cy.clearAll()
        cy.createUserWithDetails({ role: "Local Guide" })
        cy.createHike({ writer: 1 })
        cy.createHikerUser()
    })

    after(() => cy.clearAll())

    it('should allow visitors to see main hike details', () => {
        cy.visit('/hikes')
        cy.findAllByRole("button", { name: /See more details/ }).first().click()
        cy.fixture('hike').then(json => {
            cy.findByText(json.title).should('be.visible')
            cy.findAllByRole("button", /download/i).not().should('exist')
        })
    })

    it('should allow logged in users to see hike details and trackmap', () => {
        cy.loginAsLocalGuide()
        cy.visit('/hikes')
        cy.findAllByRole("button", { name: /See more details/ }).first().click()
        cy.fixture('hike').then(json => {
            cy.findByText(json.title).should('be.visible')
            cy.findAllByRole("button", /download/i).should('exist')
            cy.get(".track-map").should('be.visible')
        })
    })

    it('should allow hikers to terminate a hike', () => {

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();
        const todayExtended = `${months[month]} ${day}, ${year}`;
        new Date(year, month, day, hour, minutes - 1);

        cy.intercept({
            method: 'GET',
            url: `${SERVER_URL}/selectedHikes`
        }).as('get-started-hike-xhr')

        const startTime = dayjs().subtract(1, 'minute').format('DD/MM/YYYY, HH:mm:ss');
        cy.addCompletedHike({ selectedHike: 1, hike: 1, hiker: 2, status: 'ongoing', startTime, endTime: null })
        cy.loginAsHiker()
        cy.visit('/hikes/1')

        cy.wait('@get-started-hike-xhr').then(() => {

            // Select end time and terminate hike
            // Set date
            cy.get(".react-datetime-picker__calendar-button.react-datetime-picker__button").click({ force: true })

            // Set time
            cy.get(".react-datetime-picker__inputGroup__input.react-datetime-picker__inputGroup__hour").type(hour, { force: true })
            cy.get(".react-datetime-picker__inputGroup__input.react-datetime-picker__inputGroup__minute").type(minutes, { force: true })

            cy.findByRole("button", { name: /Terminate hike/i }).click({ force: true })

            // Check that the hike has been terminated, terminateHike button has been hidden

            cy.get('.Toastify__toast--success').contains('Hike terminated').should('be.visible');
        })
    })
})