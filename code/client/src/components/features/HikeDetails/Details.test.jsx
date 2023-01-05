import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom'
import { toast } from "react-toastify";

import api from '@services/api';
import Details from './Details'

jest.mock("@lib/helpers/location", () => ({
    getLocationFullName: (province, city) => `c${city}, p${province}`
}))

jest.mock("@components/features", () => ({
    HutCard: jest.fn()
}))

/* Mocking api and libraries */
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

const testHike = {
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
    it("Hike is correctly terminated", async () => {
        // TODO: Start hike
        const mockEndTime = '2021-01-01T12:00:00';

        api.selectedHikes.terminateHike.mockResolvedValueOnce({});

        const termintateButton = await screen.findByRole("button", { name: "Terminate hike" });
        const terminateHikeTime = await screen.findByLabelText("Select end time");

        await userEvent.type(terminateHikeTime, mockEndTime);
        userEvent.click(termintateButton);

        await waitFor(() => {
            expect(api.selectedHikes.terminateHike).toHaveBeenCalledTimes(1);
            expect(api.selectedHikes.terminateHike).toHaveBeenCalledWith(mockHikeId, mockEndTime);
        });

        /* Check success message is shown */
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledTimes(1);
            expect(toast.success).toHaveBeenCalledWith("", { "theme": "colored" });
        });
    })

    it("Shows error message if terminate hike fails", async () => {
        // TODO: Start hike
        const mockEndTime = '2021-01-01T12:00:00';

        api.selectedHikes.terminateHike.mockRejectedValueOnce({});

        const termintateButton = await screen.findByText('Terminate hike', {exact: false});
        const terminateHikeTime = await screen.findByLabelText("Select end time");

        await userEvent.type(terminateHikeTime, mockEndTime);
        userEvent.click(termintateButton);

        await waitFor(() => {
            expect(api.selectedHikes.terminateHike).toHaveBeenCalledTimes(1);
            expect(api.selectedHikes.terminateHike).toHaveBeenCalledWith(mockHikeId, mockEndTime);

        });

        /* Check error message is shown */
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledTimes(1);
            expect(toast.error).toHaveBeenCalledWith("", { "theme": "colored" });
        });
    })
})
