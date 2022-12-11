import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import api from '@services/api'
import UpdateReferencePoints from './UpdateReferencePoints'

jest.mock('react-bootstrap', () => ({
    Row: ({ children }) => <div>{children}</div>,
    Col: ({ children }) => <div>{children}</div>,
    Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}))

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}))

jest.mock('react-leaflet', () => ({
    MapContainer: (props) => <div data-testid="map">{props.children}</div>,
    Marker: ({ children }) => <div>{children}</div>,
    Popup: ({ children }) => <div>{children}</div>,
    Polyline: jest.fn(),
    TileLayer: jest.fn(),
}))

jest.mock('axios')
jest.mock('@services/api')

jest.mock('@components/features/Map', () => ({
    MarkerOnPoint: jest.fn()
}))

jest.mock('@components/form', () => ({
    Input: (props) => <mock-Input data-testid={props.id} />
}))

const mockHike = {
    track: [],
    name: "Test hike name",
    writer: { writerId: 1 },
    startPoint: {
        name: "Start point name",
        coords: [1, 2]
    },
    referencePoints: []
}

const setup = () => {
    api.hikes.getHikeDetails.mockResolvedValueOnce(mockHike)
    render(<UpdateReferencePoints />, { wrapper: MemoryRouter })
}

beforeEach(() => act(() => setup()))

describe('UpdateReferencePoints page', () => {
    it('Page is correctly rendered', () => {
        expect(screen.getByText(/Add new reference points to the hike/i)).toBeInTheDocument()
    })

    it('Map is correctly rendered', () => {
        expect(screen.getByTestId(/map/i)).toBeInTheDocument()
    })

    it('Input to type reference point name is correctly rendered', () => {
        expect(screen.getByTestId(/reference-point-name/i)).toBeInTheDocument()
    })

    it('Submit function is called on save changes', async () => {
        api.hikes.updateReferencePoints.mockResolvedValueOnce()
        await userEvent.click(screen.getByRole('button', {name: /save changes/i}))
        expect(api.hikes.updateReferencePoints).toHaveBeenCalledTimes(1)
    })
})