import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AddParkingLot from './Add'

jest.mock('react-bootstrap', () => ({
    Button: ({ children, ...props }) => <button {...props}>{children}</button>
}))

jest.mock('react-leaflet', () => ({
    MapContainer: (props) => <div data-testid="map">{props.children}</div>,
    TileLayer: jest.fn()
}))

jest.mock('@components/features/Map', () => ({
    MarkerOnPoint: jest.fn()
}))

jest.mock('@components/form', () => ({
    Input: (props) => <mock-Input data-testid={props.id} />
}))

jest.mock('axios')
jest.mock('@services/api')

const inputs = ['parkingLotName', 'capacity', 'altitude']

const setup = () => render(<AddParkingLot />, {wrapper: MemoryRouter})

beforeEach(() => setup())

describe('AddParkingLot page', () => {
    it('Page is correctly rendered', () => {
        expect(screen.getByText(/Add a new parking lot/i)).toBeInTheDocument()
    })

    it.each(inputs)('Input to type %s is correctly rendered', (input) => {
        expect(screen.getByTestId(input)).toBeInTheDocument()
    })

    it('Map is correctly rendered', () => {
        expect(screen.getByTestId(/map/i)).toBeInTheDocument()
    })
})