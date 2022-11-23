import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HikeEndpoint from './HikeEndpoint';

const testPointStart = {
    name: "Test Point Start",
    coords: [
        +51.123456,
        -0.123456
    ]
};

const testPointEnd = {
    coords: [
        +123.345,
        -123.456
    ]
};

describe("<HikeDetails.HikeEndpoint>", () => {
    
    it("Correctly renders Start point related to a hut", () => {
        render(<HikeEndpoint point={testPointStart} type="Start" />, { wrapper: MemoryRouter })
        expect(screen.getByText("Start point")).toBeInTheDocument()
        expect(screen.getByText("Test Point Start")).toBeInTheDocument()
        expect(screen.getByAltText("Start point pin")).toBeInTheDocument()
        expect(screen.getByText("Latitude: " + testPointStart.coords[0])).toBeInTheDocument()
        expect(screen.getByText("Longitude: " + testPointStart.coords[1])).toBeInTheDocument()
    });
    
    it("Correctly renders End point unrelated to a hut or parking lot", () => {
        render(<HikeEndpoint point={testPointEnd} type="End" />, { wrapper: MemoryRouter })
        expect(screen.getByText("End point")).toBeInTheDocument()
        expect(screen.getByAltText("End point pin")).toBeInTheDocument()
        expect(screen.getByText("Latitude: " + testPointEnd.coords[0])).toBeInTheDocument()
        expect(screen.getByText("Longitude: " + testPointEnd.coords[1])).toBeInTheDocument()
    });

});