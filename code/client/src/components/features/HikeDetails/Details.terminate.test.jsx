import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '@contexts/authContext'

import Details from './Details'
import api from '@services/api';
import { toast } from "react-toastify";

jest.mock('@services/api')
jest.mock('axios')
jest.mock("@lib/helpers/location", () => ({
    getLocationFullName: (province, city) => `c${city}, p${province}`
}))

HTMLCanvasElement.prototype.getContext = () => {};

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

describe("Terminate Hike", () => {

    it("Doesn't show the terminate button if hike is not started", () => {
        api.hikes.getStartedHike.mockResolvedValueOnce({ hikeId: 1, startTime: '08/01/2023, 09:00:00' })
        render(
            <AuthContext.Provider value={[{ loggedIn: true, role: "Hiker" }]}>
                <Details hike={testHike} />
            </AuthContext.Provider>,
            { wrapper: MemoryRouter }
        );
        expect(screen.queryByRole('button', { name: /terminate hike/i })).not.toBeInTheDocument()
    })

    it("Show the terminate button if hike is started", async () => {

        api.hikes.getStartedHike.mockResolvedValueOnce({ hikeId: 1, selectedHikeId: 1, startTime: '08/01/2023, 09:00:00' })
        render(
            <AuthContext.Provider value={[{ loggedIn: true, role: "Hiker" }]}>
                <Details hike={testHike} />
            </AuthContext.Provider>,
            { wrapper: MemoryRouter }
        );

        await waitFor(() => {
            expect(screen.getByText("Select end time")).toBeInTheDocument()
            expect(screen.queryByRole('button', { name: /terminate hike/i })).toBeInTheDocument()
        })
    })

    // it("Shows error message if terminating hike with a timestamp from the future", async () => {

    //     api.hikes.getStartedHike.mockResolvedValueOnce({ hikeId: 1, selectedHikeId: 1, startTime: '08/01/2023, 09:00:00' })

    //     let { container } = render(
    //         <AuthContext.Provider value={[{ loggedIn: true, role: "Hiker" }]}>
    //             <Details hike={testHike} />
    //         </AuthContext.Provider>,
    //         { wrapper: MemoryRouter }
    //     );

    //     const termintateButton = await screen.findByRole('button', { name: /terminate hike/i });
    //     const terminateHikeTime = container.querySelector("input[name=terminateTime]");

    //     // Insert a timestamp from the future
    //     const nextYear = new Date().getFullYear() + 1;
    //     fireEvent.change(terminateHikeTime, { target: { value: nextYear + "-01-01T12:00:00" } })
    //     await userEvent.click(termintateButton);

    //     // Check that the error message is shown
    //     await waitFor(() => {
    //         expect(toast.error).toHaveBeenCalledTimes(1)
    //         expect(toast.error).toHaveBeenCalledWith("End time cannot be in the future", { theme: "colored" })
    //     });
    // });

    // it("Shows error message if terminating hike with a timestamp lower than the start timestamp", async () => {

    //     api.hikes.getStartedHike.mockResolvedValueOnce({ hikeId: 1, selectedHikeId: 1, startTime: '08/01/2023, 09:00:00' })

    //     let { container } = render(
    //         <AuthContext.Provider value={[{ loggedIn: true, role: "Hiker" }]}>
    //             <Details hike={testHike} />
    //         </AuthContext.Provider>,
    //         { wrapper: MemoryRouter }
    //     );

    //     const termintateButton = await screen.findByRole('button', { name: /terminate hike/i });
    //     const terminateHikeTime = container.querySelector("input[name=terminateTime]");

    //     // Insert a timestamp from the future
    //     const nextYear = new Date().getFullYear() + 1;
    //     fireEvent.change(terminateHikeTime, { target: { value: nextYear + "-01-01T12:00:00" } })
    //     await userEvent.click(termintateButton);

    //     // Check that the error message is shown
    //     await waitFor(() => {
    //         expect(toast.error).toHaveBeenCalledTimes(1)
    //         expect(toast.error).toHaveBeenCalledWith("End time cannot be in the future", { theme: "colored" })
    //     });
    // });

})

