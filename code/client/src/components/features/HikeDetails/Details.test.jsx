import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import { AuthContext } from '@contexts/authContext'

import Details from './Details'

import api from '@services/api'

jest.mock('@services/api')
jest.mock('axios')
jest.mock("@lib/helpers/location", () => ({
    getLocationFullName: (province, city) => `c${city}, p${province}`
}))

jest.mock("@components/features", () => ({
    HutCard: jest.fn()
}))

jest.mock('react-datetime-picker', () => () => <div data-testid="datetime-picker" />)

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

    it('Start hike button is not showed if a user is not logged in', () => {
        render(
            <AuthContext.Provider value={[{ loggedIn: false }]}>
                <Details hike={testHike} />
            </AuthContext.Provider>,
            { wrapper: MemoryRouter })

        expect(screen.queryByRole('button', { name: /start this hike/i })).not.toBeInTheDocument()
    })

    it('Start hike button is not showed if a user is not logged in as an hiker', () => {
        render(
            <AuthContext.Provider value={[{ loggedIn: true, role: "Local Guide" }]}>
                <Details hike={testHike} />
            </AuthContext.Provider>,
            { wrapper: MemoryRouter })

        expect(screen.queryByRole('button', { name: /start this hike/i })).not.toBeInTheDocument()
    })

    it('Start hike button is correctly rendered if a user is logged in as an hiker and no hikes are already started', async () => {
        api.hikes.getStartedHike.mockRejectedValue({ status: 404 })
        api.hikes.startHike.mockResolvedValueOnce({})

        render(
            <AuthContext.Provider value={[{ loggedIn: true, role: "Hiker" }]}>
                <Details hike={testHike} />
            </AuthContext.Provider>,
            { wrapper: MemoryRouter })

        expect(api.hikes.getStartedHike).toHaveBeenCalledTimes(1)
        await waitFor(() => expect(screen.getByRole('button', { name: /start this hike/i })).toBeInTheDocument())
        await userEvent.click(screen.getByRole('button', { name: /start this hike/i }))
        expect(api.hikes.startHike).toHaveBeenCalledTimes(1)
    })

    it('Datetime picker for start time is not showed if a user is not logged in', () => {
        render(
            <AuthContext.Provider value={[{ loggedIn: false }]}>
                <Details hike={testHike} />
            </AuthContext.Provider>,
            { wrapper: MemoryRouter })

        expect(screen.queryByTestId(/datetime-picker/i)).not.toBeInTheDocument()
    })

    it('Datetime picker for start time is not showed if a user is not logged in as an hiker', () => {
        render(
            <AuthContext.Provider value={[{ loggedIn: true, role: "Local Guide" }]}>
                <Details hike={testHike} />
            </AuthContext.Provider>,
            { wrapper: MemoryRouter })

        expect(screen.queryByTestId(/datetime-picker/i)).not.toBeInTheDocument()
    })


    it('Datetime picker for start time is correctly rendered if a user is logged in as an hiker', async () => {
        api.hikes.getStartedHike.mockRejectedValueOnce({ status: 404 })

        render(
            <AuthContext.Provider value={[{ loggedIn: true, role: "Hiker" }]}>
                <Details hike={testHike} />
            </AuthContext.Provider>,
            { wrapper: MemoryRouter })

        expect(api.hikes.getStartedHike).toHaveBeenCalledTimes(1)
        await waitFor(() => expect(screen.getByTestId(/datetime-picker/i)).toBeInTheDocument())
    })

    it('Timewatch is correctly rendered if this hike is already started', async () => {
        api.hikes.getStartedHike.mockResolvedValueOnce({ hikeId: 1, startTime: '08/01/2023, 09:00:00' })

        render(
            <AuthContext.Provider value={[{ loggedIn: true, role: "Hiker" }]}>
                <Details hike={testHike} />
            </AuthContext.Provider>,
            { wrapper: MemoryRouter })

        expect(api.hikes.getStartedHike).toHaveBeenCalledTimes(1)
        await waitFor(() => expect(screen.queryByTestId('button', { name: /start this hike/i })).not.toBeInTheDocument())
        await waitFor(() => expect(screen.getByTestId(/timewatch/i)).toBeInTheDocument())
    })

    it('Warning message is correctly rendered if another hike is already started', async () => {
        api.hikes.getStartedHike.mockResolvedValueOnce({ hikeId: 2, startTime: '08/01/2023, 09:00:00' })

        render(
            <AuthContext.Provider value={[{ loggedIn: true, role: "Hiker" }]}>
                <Details hike={testHike} />
            </AuthContext.Provider>,
            { wrapper: MemoryRouter })

        expect(api.hikes.getStartedHike).toHaveBeenCalledTimes(1)
        await waitFor(() => expect(screen.queryByTestId('button', { name: /start this hike/i })).not.toBeInTheDocument())
        await waitFor(() => expect(screen.queryByTestId(/timewatch/i)).not.toBeInTheDocument())
        await waitFor(() => expect(screen.getByText(/You cannot start this hike/i)).toBeInTheDocument())
    })
})