import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '@contexts/authContext'

import Details from './Details'
import api from '@services/api';
import { toast } from "react-toastify";

jest.mock('@services/api');
jest.mock("axios");

jest.mock("@lib/helpers/location", () => ({
    getLocationFullName: (province, city) => `c${city}, p${province}`
}))

jest.mock("@components/features", () => ({
    HutCard: jest.fn()
}))

jest.mock('react-toastify', () => {
    return {
        toast: {
            success: jest.fn(),
            error: jest.fn()
        }
    };
});

const testHike = {
    hikeId: 1,
    title: "title",
    writer: { writerName: "writer", writerId: 0 },
    difficulty: "difficulty",
    province: 0,
    city: 0,
    description: "description",
    startPoint: {
        name: "start",
    },
    endPoint: {
        name: "end",
    },
    referencePoints: [
        { name: "ref1" },
        { name: "ref2" },
    ],
    huts: [
        {
            hutId: 1,
            hutName: "Rifugio test",
            coords: []
        }
    ],
    maxElevation: 1200,
    length: 1,
    ascent: 300,
    expectedTime: {
        hours: 5,
        minutes: 30
    }
}

const expected = {
    base: [
        { label: "title", value: testHike.title },
        { label: "writer", value: testHike.writer.writerName },
        { label: "difficulty", value: testHike.difficulty },
        { label: "location", value: `c${testHike.city}, p${testHike.province}` },
        { label: "description", value: testHike.description },
        { label: "start point", value: testHike.startPoint.name },
        { label: "end point", value: testHike.endPoint.name },
        { label: "elevation", value: /1200 m/i },
        { label: "length", value: /1 km/i },
        { label: "ascent", value: /300 m/i },
        { label: "RT time", value: /5h : 30m/i }
    ],
    referencePoints: [
        ...testHike.referencePoints
    ]
}

describe("HikeDetails.Details component", () => {
    it.each(expected.base)
        ("Hike $label is correctly rendered", (item) => {
            render(<Details hike={testHike} />, { wrapper: MemoryRouter })
            expect(screen.getByText(item.value)).toBeInTheDocument()
        })

    it.each(expected.referencePoints)
        ("Hike reference point $name is correctly rendered", (point) => {
            render(<Details hike={testHike} />, { wrapper: MemoryRouter })
            expect(screen.getByText(point.name)).toBeInTheDocument()
        })
})

describe("Terminate Hike", () => {

    let container;

    beforeEach(() => {
        let component = render(
            <AuthContext.Provider value={[{ loggedIn: true, role: "Hiker" }]}>
                <Details hike={testHike} />
            </AuthContext.Provider>,
            { wrapper: MemoryRouter }
        );
        container = component.container;
    })

    // TODO: Uncomment this when the start hike is implemented
    // it("Doesn't show the terminate button if hike is not started", () => {
    //     expect(screen.queryByRole('button', { name: /terminate hike/i })).not.toBeInTheDocument()
    // })

    it("Show the terminate button if hike is started", () => {
        // TODO: Start hike
        expect(screen.queryByRole('button', { name: /terminate hike/i })).toBeInTheDocument()
        expect(screen.queryByText("Select end time")).toBeInTheDocument()
    })

    it("Shows error message if terminating hike with a timestamp from the future", async () => {
        // TODO: Start hike

        const termintateButton = await screen.findByRole('button', { name: /terminate hike/i });
        const terminateHikeTime = container.querySelector("input[name=terminateTime]");
    
        // Insert a timestamp from the future
        const nextYear = new Date().getFullYear() + 1;
        fireEvent.change(terminateHikeTime, {target: {value: nextYear + "-01-01T12:00:00"}})
        await userEvent.click(termintateButton);

        // Check that the error message is shown
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledTimes(1)
            expect(toast.error).toHaveBeenCalledWith("End time cannot be in the future", { theme: "colored" })
        });
    });

    it("Hike is correctly terminated", async () => {
        // TODO: Start hike
        const mockEndTime = '2021-01-01T12:00:00';
        const endTimeFormatted = '1/1/2021, 12:00:00';
        const mockHikeId = 1;

        api.selectedHikes.terminateHike.mockResolvedValueOnce({});

        const termintateButton = await screen.findByRole('button', { name: /terminate hike/i });
        const terminateHikeTime = container.querySelector("input[name=terminateTime]");

        fireEvent.change(terminateHikeTime, {target: {value: mockEndTime}})
        userEvent.click(termintateButton);

        await waitFor(() => {
            expect(api.selectedHikes.terminateHike).toHaveBeenCalledTimes(1);
            expect(api.selectedHikes.terminateHike).toHaveBeenCalledWith(mockHikeId, endTimeFormatted);
        });

        /* Check success message is shown */
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledTimes(1);
            expect(toast.success).toHaveBeenCalledWith("Hike terminated", { "theme": "colored" });
        });
    })

    it("Shows error message if terminate hike fails", async () => {
        // TODO: Start hike
        const mockEndTime = '2021-01-01T12:00:00';
        const endTimeFormatted = '1/1/2021, 12:00:00';
        const mockErrorMessage = "Error terminating hike";
        const mockHikeId = 1;

        api.selectedHikes.terminateHike.mockRejectedValueOnce(mockErrorMessage);

        const termintateButton = await screen.findByRole('button', { name: /terminate hike/i });
        const terminateHikeTime = container.querySelector("input[name=terminateTime]");

        fireEvent.change(terminateHikeTime, {target: {value: mockEndTime}})
        await userEvent.click(termintateButton);

        await waitFor(() => {
            expect(api.selectedHikes.terminateHike).toHaveBeenCalledTimes(1);
            expect(api.selectedHikes.terminateHike).toHaveBeenCalledWith(mockHikeId, endTimeFormatted);
        });

        /* Check error message is shown */
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledTimes(1);
            expect(toast.error).toHaveBeenCalledWith(mockErrorMessage, { "theme": "colored" });
        });
    })
})
