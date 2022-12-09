import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import api from '@services/api'
import UpdateLinkedHuts from './UpdateLinkedHuts'

jest.mock('react-bootstrap', () => ({
    Button: ({ children, ...props }) => <button {...props}>{children}</button>
}))

jest.mock('react-leaflet', () => ({
    MapContainer: (props) => <div data-testid="map">{props.children}</div>,
    Marker: ({ children }) => <div>{children}</div>,
    Popup: ({ children }) => <div>{children}</div>,
    Polyline: jest.fn(),
    TileLayer: jest.fn(),
}))

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    }
}))

jest.mock('axios')
jest.mock('@services/api')

const mockHike = {
    track: [],
    name: "Test hike name",
    writer: { writerId: 1 },
    startPoint: {
        name: "Start point name",
        coords: [1, 2]
    },
    huts: [
        { hutId: 1, hutName: "Linked hut 1", coords: [] }
    ],
}

const mockLinkableHuts = [
    { hutId: 2, hutName: "Test Linkable hut 2", coords: [] },
    { hutId: 3, hutName: "Test Linkable hut 3", coords: [] },
]

const setup = () => {
    api.hikes.getHikeDetails.mockResolvedValueOnce(mockHike)
    api.hikes.getLinkableHuts.mockResolvedValueOnce(mockLinkableHuts)
    render(<UpdateLinkedHuts />, { wrapper: MemoryRouter })
}

beforeEach(() => act(() => setup()))

describe('UpdateLinkedHuts page', () => {
    it('Page is correctly rendered', () => {
        expect(screen.getByText(/link huts/i)).toBeInTheDocument()
    })

    it('Map is correctly rendered', () => {
        expect(screen.getByTestId(/map/i)).toBeInTheDocument()
    })

    it('Linked huts are correctly rendered', () => {
        expect(screen.getByText(/linked hut 1/i)).toBeInTheDocument()
        expect(screen.getAllByRole('button', { name: /remove/i })).toHaveLength(1)
    })

    it('Linkable huts are correctly rendered', () => {
        expect(screen.getAllByText(/test linkable hut/i)).toHaveLength(2)
        expect(screen.getAllByRole('button', { name: /link this hut/i })).toHaveLength(2)
    })

    it('Submit function is called on save changes', async () => {
        api.hikes.updateLinkedHuts.mockResolvedValueOnce()
        await userEvent.click(screen.getByRole('button', { name: /save changes/i }))
        expect(api.hikes.updateLinkedHuts).toHaveBeenCalledTimes(1)
    })
})