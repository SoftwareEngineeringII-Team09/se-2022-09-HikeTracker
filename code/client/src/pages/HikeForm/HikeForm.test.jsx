import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");
import { toast } from "react-toastify"
import api from '../../services/api';

const gpxTestTrack = require("./gpxTestTrack.gpx");

/* Mocking the login api and libraries */
jest.mock('../../services/api');

jest.mock("axios");

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate
}));

function FormDataMock() {
    this.append = jest.fn();
}
global.FormData = FormDataMock

jest.mock('react-toastify', () => {
    return {
        toast: {
            success: jest.fn(),
            error: jest.fn()
        }
    };
});

import HikeForm from './HikeForm'

describe("Page for adding new hike", () => {

    it("Hike form page correctly rendered", () => {
        render(<HikeForm />, { wrapper: MemoryRouter })
        expect(screen.getByText("Insert hike data")).toBeInTheDocument();
    })

    it("Hike form page renders a form for inserting data of a new hike", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <HikeForm />
            </Router>
        )

        await userEvent.type(screen.getByLabelText("Title:"), 'My title!')
        expect(screen.getByDisplayValue("My title!")).toBeInTheDocument()

        await userEvent.type(screen.getByLabelText("Expected time:"), '0230')
        expect(screen.getByDisplayValue("02:30")).toBeInTheDocument()

        await userEvent.type(screen.getByLabelText("Description:"), 'Prova!')
        expect(screen.getByDisplayValue("Prova!")).toBeInTheDocument()
    })

    it("Redirects to /hikes/:id after successfully creating an hike", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <HikeForm />
            </Router>
        )

        /* Mock api calls */
        api.hikes.createHike.mockResolvedValueOnce({  hikeId: 1 });

        await userEvent.type(screen.getByLabelText("Title:"), 'My title!')
        await userEvent.selectOptions(screen.getByLabelText("Region:"), "Piemonte")
        await userEvent.selectOptions(screen.getByLabelText("Province:"), "Torino")
        await userEvent.selectOptions(screen.getByLabelText("City:"), 'Alpette')
        await userEvent.selectOptions(screen.getByLabelText("Difficulty:"), 'Tourist')
        await userEvent.type(screen.getByLabelText("Expected time:"), '0230')
        await userEvent.type(screen.getByLabelText("Description:"), 'Test description')
        await userEvent.upload(screen.getByLabelText("Insert your gpx file:"), gpxTestTrack)
        await userEvent.click(screen.getByRole("button"))

        const expectedFormData = new FormData();
        expectedFormData.append('title', "My title!");
        expectedFormData.append('region', "Piemonte");
        expectedFormData.append('province', "Torino");
        expectedFormData.append('city', "Alpette");
        expectedFormData.append('difficulty', "Tourist");
        expectedFormData.append('expectedTime', "02,30");
        expectedFormData.append('description', "Test description");
        expectedFormData.append('file', gpxTestTrack);

        await waitFor(() => {
            expect(api.hikes.createHike).toHaveBeenCalledTimes(1)
        })
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledTimes(1)
            expect(toast.success).toHaveBeenCalledWith("Hike created successfully", { theme: "colored" })
        })
        await waitFor(() => {
            expect(mockedUsedNavigate).toHaveBeenCalledWith("/browse/1")
        })
    })

    it("Shows error message if creation is unsuccessful", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <HikeForm />
            </Router>
        )

        /* Mock api calls */
        const errorMessage = "There has been and error while creating the hike"
        api.hikes.createHike.mockRejectedValueOnce(new Error(errorMessage));

        await userEvent.click(screen.getByRole("button"))

        await waitFor(() => {
            expect(api.hikes.createHike).toHaveBeenCalledTimes(1)
        })
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledTimes(1)
            expect(toast.error).toHaveBeenCalledWith(errorMessage, { theme: "colored" })
        })
    })

})