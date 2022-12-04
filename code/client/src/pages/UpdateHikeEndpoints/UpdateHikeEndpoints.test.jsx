import { render, screen, waitFor } from '@testing-library/react';
import UpdateHikeEndpoints from './UpdateHikeEndpoints';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from "history";
import { Router } from 'react-router-dom';
import { toast } from "react-toastify";
import api from '@services/api';

/* Mocking api and libraries */
jest.mock('../../services/api');
jest.mock("axios");

var mockHikeId = 1;
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ hikeId: mockHikeId }),
    useNavigate: () => mockedUseNavigate
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

describe("<UpdateHikeEndpoints />", () => {

    it("Correctly renders component", async () => {

        const route = `/hikes/${mockHikeId}/update-endpoints`;
        const history = createMemoryHistory({ initialEntries: [route] });

        /* Mock api call */
        api.hikes.getHikeDetails.mockResolvedValue(mockHike);
        api.hikes.getPotentialPoints.mockResolvedValue({
            potentialStartPoints: [],
            potentialEndPoints: []
        });

        render(
            <Router location={history.location} navigator={history}>
                <UpdateHikeEndpoints />
            </Router>
        );

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

        const route = `/hikes/${mockHikeId}/update-endpoints`;
        const history = createMemoryHistory({ initialEntries: [route] });
        const errorMessage = "Hike not found";

        api.hikes.getHikeDetails.mockRejectedValue(errorMessage);

        render(
            <Router location={history.location} navigator={history}>
                <UpdateHikeEndpoints />
            </Router>
        );

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

        const route = `/hikes/${mockHikeId}/update-endpoints`;
        const history = createMemoryHistory({ initialEntries: [route] });

        /* Mock api call */
        api.hikes.updateHikeEndpoints.mockResolvedValueOnce({});
        api.hikes.getHikeDetails.mockResolvedValue(mockHike);
        api.hikes.getPotentialPoints.mockResolvedValue({
            potentialStartPoints: [],
            potentialEndPoints: []
        });

        render(
            <Router location={history.location} navigator={history}>
                <UpdateHikeEndpoints />
            </Router>
        );

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

    it("Returns to hike details", async () => {
        const route = `/hikes/${mockHikeId}/update-endpoints`;
        const history = createMemoryHistory({ initialEntries: [route] });

        /* Mock api call */
        api.hikes.updateHikeEndpoints.mockResolvedValueOnce({});
        api.hikes.getHikeDetails.mockResolvedValue(mockHike);
        api.hikes.getPotentialPoints.mockResolvedValue({
            potentialStartPoints: [],
            potentialEndPoints: []
        });

        render(
            <Router location={history.location} navigator={history}>
                <UpdateHikeEndpoints />
            </Router>
        );

        const returnToHikeDetails = await screen.findByRole("link", { name: "Return to hike details" });
        console.log(returnToHikeDetails);
        await userEvent.click(returnToHikeDetails);

        /* Check the user is redirected to hike details */
        await waitFor(() => {
            expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
            expect(mockedUseNavigate).toHaveBeenCalledWith('/browse/1');
        });
    });

    it("Shows error message if something goes wrong during update", async () => {

        const route = `/hikes/${mockHikeId}/update-endpoints`;
        const history = createMemoryHistory({ initialEntries: [route] });
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

        render(
            <Router location={history.location} navigator={history}>
                <UpdateHikeEndpoints />
            </Router>
        );

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

        const route = `/hikes/${mockHikeId}/update-endpoints`;
        const history = createMemoryHistory({ initialEntries: [route] });

        /* Mock api call */
        api.hikes.updateHikeEndpoints.mockResolvedValueOnce({});
        api.hikes.getHikeDetails.mockResolvedValue(mockHike);
        api.hikes.getPotentialPoints.mockResolvedValue({
            potentialStartPoints: [
                {
                    name: "Start point name",
                    coords: [1, 2],
                    type: "Parking Lot"
                }
            ],
            potentialEndPoints: [
                {
                    name: "End point name",
                    coords: [3, 4],
                    type: "Hut"
                }
            ]
        });

        render(
            <Router location={history.location} navigator={history}>
                <UpdateHikeEndpoints />
            </Router>
        );

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
                    "coords": [
                        1,
                        2,
                    ],
                    type: "Parking Lot"
                },
                "newEndPoint": {
                    "coords": [
                        3,
                        4,
                    ],
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