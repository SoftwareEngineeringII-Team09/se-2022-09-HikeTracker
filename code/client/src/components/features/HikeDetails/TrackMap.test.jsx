import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import TrackMap from './TrackMap'

jest.mock('react-leaflet', () => {
    const MapContainer = (props) => <div data-testid='map'>{props.children}</div>
    const TileLayer = (props) => <a href={props.url} />
    const Polyline = () => <span />
    const Marker = (props) => <div>{props.children}</div>
    const Popup = (props) => <div>{props.children}</div>

    return ({ MapContainer, TileLayer, Polyline, Marker, Popup })
})

const testProps = {
    start: [],
    end: [],
    track: []
}

describe("TrackMap component", () => {
    it("Component is correctly rendered", () => {
        render(<TrackMap {...testProps} />, { wrapper: MemoryRouter })
        expect(screen.getByTestId("map")).toBeInTheDocument()
    })
})