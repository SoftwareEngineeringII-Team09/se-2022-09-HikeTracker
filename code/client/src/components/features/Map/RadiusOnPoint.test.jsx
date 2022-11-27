import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MapContainer, useMapEvents } from 'react-leaflet'

import RadiusOnPoint from './RadiusOnPoint'

jest.mock('react-leaflet', () => ({
    MapContainer: (props) => <div>{props.children}</div>,
    Circle: () => <div data-testid="circle" />,
    useMapEvents: jest.fn()
}))

const props = {
    default: {
        radius: 0,
        currentPoint: { lat: 50.3, lng: 50.7 },
        setCurrentPoint: jest.fn()
    },
    empty: {
        radius: 0,
        currentPoint: { lat: 0, lng: 0 },
        setCurrentPoint: jest.fn()
    }
}

const setup = {
    default: () => render(<RadiusOnPoint {...props.default} />, { wrapper: MemoryRouter }),
    empty: () => render(<RadiusOnPoint {...props.empty} />, { wrapper: MemoryRouter })
}

describe('RadiusOnPoint Map component', () => {
    it('Component is correctly rendered when currentPoint is not null', () => {
        setup.default()
        expect(screen.getByTestId('circle')).toBeInTheDocument()
    })

    it('Component is not rendered when currentPoint is null', () => {
        setup.empty()
        expect(screen.queryByTestId('circle')).not.toBeInTheDocument()
    })
})

