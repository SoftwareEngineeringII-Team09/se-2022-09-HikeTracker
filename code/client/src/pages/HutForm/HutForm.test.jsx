import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");

import HutForm from './HutForm'

jest.mock('react-leaflet', () => {
    const MapContainer = ({ children }) => <div>{children}</div>
    const TileLayer = () => <div />

    return ({ MapContainer, TileLayer })
})
const mockMarkerOnPoint = jest.fn()
jest.mock('@components/features/Map', () => ({
    MarkerOnPoint: (props) => {
        mockMarkerOnPoint(props)
        return <mock-MarkerOnPoint />
    }
}))

describe("Hut form page", () => {
    it("Hut form page correctly rendered", () => {
        render(<HutForm />, { wrapper: MemoryRouter })
        expect(screen.getByText("Insert hut data")).toBeInTheDocument();
    })

    it("Hut form page renders a form for inserting data of a new hut", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <HutForm />
            </Router>
        )

        await userEvent.type(screen.getByLabelText("Name:"), 'Rifugio1')
        expect(screen.getByDisplayValue("Rifugio1")).toBeInTheDocument()

        // await userEvent.type(screen.getByLabelText("Address:"), 'Via Roma 1')
        // expect(screen.getByDisplayValue("Via Roma 1")).toBeInTheDocument()

        // await userEvent.type(screen.getByLabelText("Latitude:"), '12.3456789')
        // expect(screen.getByDisplayValue("12.3456789")).toBeInTheDocument()

        // await userEvent.type(screen.getByLabelText("Longitude:"), '-98.7654321')
        // expect(screen.getByDisplayValue("-98.7654321")).toBeInTheDocument()

        await userEvent.type(screen.getByLabelText("Altitude: (m)"), '4321')
        expect(screen.getByDisplayValue("4321")).toBeInTheDocument()

        await userEvent.type(screen.getByLabelText("Number of beds:"), '25')
        expect(screen.getByDisplayValue("25")).toBeInTheDocument()
    })
})