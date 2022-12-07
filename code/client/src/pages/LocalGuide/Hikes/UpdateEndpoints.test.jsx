import { render, screen, waitFor } from '@testing-library/react';
import UpdateEndpoints from './UpdateEndpoints';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from "history";
import { Router } from 'react-router-dom';
import { toast } from "react-toastify";
import api from '@services/api';

/* Mocking api and libraries */
jest.mock('@services/api');
jest.mock("axios");

let mockHikeId = 1;

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ hikeId: mockHikeId }),
}));

jest.mock('react-toastify', () => {
    return {
        toast: {
            success: jest.fn(),
            error: jest.fn()
        }
    };
});


jest.mock('react-leaflet', () => {
    const MapContainer = (props) => <div data-testid='map'>{props.children}</div>
    const TileLayer = (props) => <a href={props.url} />
    const Polyline = () => <span />
    const Marker = (props) => <div>{props.children}</div>
    const Popup = (props) => <div>{props.children}</div>

    return ({ MapContainer, TileLayer, Polyline, Marker, Popup })
})

const mockHike = {
    track: [],
    name: "Test hike name",
    startPoint: {
        name: "Start point name",
        coords: [1, 2]
    },
    endPoint: {
        name: "End point name",
        coords: [22, 11]
    }
}

function buildHistory() {
    const route = `/hikes/${mockHikeId}/update-endpoints`;
    const history = createMemoryHistory({ initialEntries: [route] });
    return history;
}

function renderComponent(history) {
    render(
        <Router location={history.location} navigator={history}>
            <UpdateEndpoints />
        </Router>
    );
}

function mockApiCalls() {
    api.hikes.updateHikeEndpoints.mockResolvedValueOnce({});
    api.hikes.getHikeDetails.mockResolvedValue(mockHike);
    api.hikes.getPotentialPoints.mockResolvedValue({
        potentialStartPoints: [],
        potentialEndPoints: []
    });
}

describe("<UpdateHikeEndpoints />", () => {

    it("Correctly renders component", async () => {

        const history = buildHistory();
        mockApiCalls();
        renderComponent(history);

        await waitFor(() => {
            expect(screen.getByText("Test hike name")).toBeInTheDocument();
            expect(screen.getAllByText("Start point name")).toHaveLength(2);
            expect(screen.getAllByText("End point name")).toHaveLength(2);
            expect(screen.getByText("Latitude: 1")).toBeInTheDocument();
            expect(screen.getByText("Longitude: 2")).toBeInTheDocument();
            expect(screen.getByText("Latitude: 22")).toBeInTheDocument();
            expect(screen.getByText("Longitude: 11")).toBeInTheDocument();
            expect(screen.getByText("Return to hike details")).toBeInTheDocument();
        });
    })

    it("Shows error message for non-existing hikes", async () => {

        const history = buildHistory();
        const errorMessage = "Hike not found";

        api.hikes.getHikeDetails.mockRejectedValue(errorMessage);
        renderComponent(history);

        /* Check the getHikeDetails function is called */
        await waitFor(() => {
            expect(api.hikes.getHikeDetails).toHaveBeenCalledTimes(1);
            expect(api.hikes.getHikeDetails).toHaveBeenCalledWith(mockHikeId);
        });

        /* Check the error message is displayed */
        await waitFor(async () => {
            expect(screen.getByText(`There has been a problem loading the hike: ${errorMessage}`)).toBeInTheDocument()
        });
    });

    it("Doesn't call the API if endpoints haven't been updated", async () => {

        const history = buildHistory();
        mockApiCalls();
        renderComponent(history);
        const submitButton = await screen.findByRole("button", { name: "Save points" });

        /* Check the getHikeDetails function is called */
        await waitFor(() => {
            expect(api.hikes.getHikeDetails).toHaveBeenCalledTimes(1);
            expect(api.hikes.getHikeDetails).toHaveBeenCalledWith(mockHikeId);
        });

        await userEvent.click(submitButton);

        /* Check success message is shown */
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledTimes(1);
            expect(toast.success).toHaveBeenCalledWith("Points have been successfully updated", { "theme": "colored" });
        });

        /* Check the updateHikeEndpoints function is not called */
        await waitFor(() => {
            expect(api.hikes.updateHikeEndpoints).toHaveBeenCalledTimes(0);
        });

    });

    it("Links to the hike details", async () => {
        const history = buildHistory();

        mockApiCalls();
        renderComponent(history);

        const returnToHikeDetails = await screen.findByRole("link", { name: "Return to hike details" });
        expect(returnToHikeDetails).toHaveAttribute("href", `/browse/${mockHikeId}`);
    });

    it("Shows error message if something goes wrong during update", async () => {

        const history = buildHistory();
        const updateErrorMessage = "Error updating endpoints";

        /* Mock api call */
        api.hikes.updateHikeEndpoints.mockRejectedValueOnce(updateErrorMessage);
        api.hikes.getHikeDetails.mockResolvedValue(mockHike);
        api.hikes.getPotentialPoints.mockResolvedValue({
            potentialStartPoints: [
                {
                    name: "Start point name",
                    coords: [1, 2]
                }
            ],
            potentialEndPoints: []
        });

        renderComponent(history);

        /* Click on "Set start point" button */
        const setStartPointButton = await screen.findByRole("button", { name: "Set as start point" });
        await userEvent.click(setStartPointButton);

        /* Update hike endpoint */
        const submitButton = await screen.findByRole("button", { name: "Save points" });
        await userEvent.click(submitButton);

        /* Check the updateHikeEndpoints function is not called */
        await waitFor(() => {
            expect(api.hikes.updateHikeEndpoints).toHaveBeenCalledTimes(1);
        });

        /* Check error message is shown */
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledTimes(1);
            expect(toast.error).toHaveBeenCalledWith(updateErrorMessage, { "theme": "colored" });
        });

    });


    it("Correctly updates start/end point", async () => {

        const history = buildHistory();

        /* Mock api call */
        api.hikes.updateHikeEndpoints.mockResolvedValueOnce({});
        api.hikes.getHikeDetails.mockResolvedValue(mockHike);
        api.hikes.getPotentialPoints.mockResolvedValue({
            potentialStartPoints: [
                {
                    name: "Start point name",
                    coords: [1, 2],
                    type: "Parking Lot",
                    id: 3
                }
            ],
            potentialEndPoints: [
                {
                    name: "End point name",
                    coords: [3, 4],
                    type: "Hut",
                    id: 1
                }
            ]
        });

        renderComponent(history);

        /* Click on "Set start point" and "Set end point" buttons */
        const setStartPointButton = await screen.findByRole("button", { name: "Set as start point" });
        const setEndPointButton = await screen.findByRole("button", { name: "Set as end point" });
        await userEvent.click(setStartPointButton);
        await userEvent.click(setEndPointButton);

        /* Update hike endpoint */
        const submitButton = await screen.findByRole("button", { name: "Save points" });
        await userEvent.click(submitButton);

        /* Check the updateHikeEndpoints function is called */
        await waitFor(() => {
            expect(api.hikes.updateHikeEndpoints).toHaveBeenCalledTimes(1);
            expect(api.hikes.updateHikeEndpoints).toHaveBeenCalledWith(mockHikeId, {
                "newStartPoint": {
                    id: 3,
                    type: "Parking Lot"
                },
                "newEndPoint": {
                    id: 1,
                    type: "Hut"
                },
            });
        });

        /* Check success message is shown */
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledTimes(1);
            expect(toast.success).toHaveBeenCalledWith("Points have been successfully updated", { "theme": "colored" });
        });

    });

});