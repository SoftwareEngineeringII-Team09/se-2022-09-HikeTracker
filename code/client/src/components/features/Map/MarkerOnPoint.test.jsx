import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import MarkerOnPoint from './MarkerOnPoint'

jest.mock('react-leaflet', () => ({
    Marker: () => <div data-testid="marker" />,
    useMapEvents: jest.fn()
}))

const props = {
    default: {
        point: { latitude: 50.3, longitude: 50.7 },
        setPoint: jest.fn()
    },
    empty: {
        point: { latitude: 0, longitude: 0 },
        setPoint: jest.fn()
    }
}

const setup = {
    default: () => render(<MarkerOnPoint {...props.default} />, { wrapper: MemoryRouter }),
    empty: () => render(<MarkerOnPoint {...props.empty} />, { wrapper: MemoryRouter })
}

describe('MarkerOnPoint Map component', () => {
    it('Component is correctly rendered when point is not null', () => {
        setup.default()
        expect(screen.getByTestId('marker')).toBeInTheDocument()
    })

    it('Component is not rendered when point is null', () => {
        setup.empty()
        expect(screen.queryByTestId('marker')).not.toBeInTheDocument()
    })
})

