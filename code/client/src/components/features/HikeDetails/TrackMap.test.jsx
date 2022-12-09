import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import TrackMap from './TrackMap'

jest.mock('react-leaflet', () => {
    const MapContainer = (props) => <div data-testid='map'>{props.children}</div>
    const TileLayer = (props) => <a href={props.url} />
    const Polyline = () => <span />
    const Marker = (props) => <div><img alt={props.alt || "Marker"} />{props.children}</div>
    const Popup = (props) => <div>{props.children}</div>

    return ({ MapContainer, TileLayer, Polyline, Marker, Popup })
})

const testProps = {
    start: [],
    end: [],
    track: [],
    references: [],
    potentials: [],
}

describe("TrackMap component", () => {
    it("Component is correctly rendered", () => {
        render(<TrackMap {...testProps} />, { wrapper: MemoryRouter })
        expect(screen.getByTestId("map")).toBeInTheDocument()
    })

    it("Renders potential markers and start/end points", async () => {
        const trackMapProps = {
            ...testProps,
            potentials: [
                { name: "Potential start", coordinates: [1, 2] },
                { name: "Potential end", coordinates: [3, 4] },
            ],
            start: { name: "Start", coordinates: [10, 20] },
            end: { name: "End", coordinates: [30, 40] },
        }
        render(<TrackMap {...trackMapProps} />, { wrapper: MemoryRouter })
        await waitFor(() => {
            expect(screen.getAllByAltText("Marker")).toHaveLength(2)
            expect(screen.getAllByAltText("Start marker")).toHaveLength(1)
            expect(screen.getAllByAltText("End marker")).toHaveLength(1)
        });
    });
})