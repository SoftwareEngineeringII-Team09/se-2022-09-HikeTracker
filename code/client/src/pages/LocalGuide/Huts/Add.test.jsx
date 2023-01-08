
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");
import { toast } from "react-toastify"
import api from '@services/api';


/* Mocking the login api and libraries */
jest.mock('@services/api');

jest.mock("axios");
jest.mock('react-toastify', () => {
    return {
        toast: {
            success: jest.fn(),
            error: jest.fn()
        }
    };
});

import AddHut from './Add'
const hutImage = require("@data/test/hut.jpg");
const gpxTestTrack = require("@data/test/gpxTestTrack.gpx");

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
        render(<AddHut />, { wrapper: MemoryRouter })
        expect(screen.getByText("Add a new hut")).toBeInTheDocument();
    })

    it("Hut form page renders a form for inserting data of a new hut", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <AddHut />
            </Router>
        )

        /* Mock api calls */
        api.huts.createHut.mockResolvedValueOnce({ hutId: 1 });
        api.geolocalization.checkPointCity.mockResolvedValueOnce({ city: "Alpette", province: "Torino", region: "Piemonte" });

        await userEvent.type(screen.getByLabelText("Name"), 'Rifugio1')
        expect(screen.getByDisplayValue("Rifugio1")).toBeInTheDocument()

        await userEvent.selectOptions(screen.getByLabelText("Region"), "Piemonte")
        expect(screen.getByDisplayValue("Piemonte")).toBeInTheDocument()
        await userEvent.selectOptions(screen.getByLabelText("Province"), "Torino")
        expect(screen.getByDisplayValue("Torino")).toBeInTheDocument()
        await userEvent.selectOptions(screen.getByLabelText("City"), 'Alpette')
        expect(screen.getByDisplayValue("Alpette")).toBeInTheDocument()

        await userEvent.type(screen.getByLabelText("Altitude (m)"), '4321')
        expect(screen.getByDisplayValue("4321")).toBeInTheDocument()

        await userEvent.type(screen.getByLabelText("Number of beds"), '25')
        expect(screen.getByDisplayValue("25")).toBeInTheDocument()

        await userEvent.type(screen.getByLabelText("Phone number"), '3921234567')
        expect(screen.getByDisplayValue("3921234567")).toBeInTheDocument()

        await userEvent.type(screen.getByLabelText("Email"), 'email@example.com')
        expect(screen.getByDisplayValue("email@example.com")).toBeInTheDocument()

        await userEvent.type(screen.getByLabelText("Website (optional)"), 'www.example.com')
        expect(screen.getByDisplayValue("www.example.com")).toBeInTheDocument()

        await userEvent.upload(screen.getByLabelText("Cover image"), hutImage, { applyAccept: false })

        await userEvent.click(screen.getByRole("button"))

        await waitFor(() => {
            expect(api.geolocalization.checkPointCity).toHaveBeenCalledTimes(1)
            expect(api.huts.createHut).toHaveBeenCalledTimes(1)
        })
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledTimes(1)
            expect(toast.success).toHaveBeenCalledWith("The new hut has been correctly added", { theme: "colored" })
        })
    })

    it("Shows wrong format error message if uploaded image has wrong format", async() => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <AddHut />
            </Router>
        )

        await userEvent.upload(screen.getByLabelText("Cover image"), gpxTestTrack, { applyAccept: false })
        await userEvent.click(screen.getByRole("button"))

        await waitFor(() => {
            expect(screen.getByText("Provide a valid image")).toBeInTheDocument();
        })
    })
})