import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import HikesFilters from './HikesFilters'

jest.mock('react-bootstrap', () => {
    const Offcanvas = (props) => <div>{props.children}</div>
    Offcanvas.Header = (props) => <div>{props.children}</div>
    Offcanvas.Title = (props) => <h1>{props.children}</h1>
    Offcanvas.Body = (props) => <div>{props.children}</div>

    const Button = ({ children, ...props }) => <button {...props}>{children}</button>

    return ({ Offcanvas, Button })
})

jest.mock('@lib/helpers', () => ({
    helperFilters: {
        defaultFilters: {},
        filtersKeys: [],
        getFilterName: jest.fn(),
        getFilterValues: jest.fn(),
        getFilterLabel: jest.fn()
    }
}))

const mockGeoAreaFilter = jest.fn()
jest.mock('./GeoAreaFilter', () => (props) => {
    mockGeoAreaFilter(props)
    return <mock-GeoAreaFilter data-testid="geo-area-filter" />
})

const mockFilterRadioButton = jest.fn()
jest.mock('./FilterRadioButton', () => (props) => {
    mockFilterRadioButton(props)
    return <mock-FilterRadioButton data-testid="filter-radio-button" />
})

const testProps = {
    filters: {
        difficulty: ["Tourist", "Hiker", "Professional Hiker"],
        length: [{ max: 5 }, { min: 5, max: 10 }, { min: 10, max: 15 }, { min: 15 },]
    },
    setFilters: jest.fn(),
    isOpen: true,
    close: jest.fn()
}

describe("HikesFilters component", () => {
    it("Filters are closed if close button is clicked", async () => {
        render(<HikesFilters {...testProps} />, { wrapper: MemoryRouter })
        await userEvent.click(screen.getByTestId('close-button'))
        expect(testProps.close).toHaveBeenCalledTimes(1)
    })

    it("Filters are updated when apply button is clicked", async () => {
        render(<HikesFilters {...testProps} />, { wrapper: MemoryRouter })
        await userEvent.click(screen.getByRole('button', { name: "Apply" }))
        expect(testProps.setFilters).toHaveBeenCalledTimes(1)
        expect(testProps.close).toHaveBeenCalledTimes(1)
    })

    it("States are resetted when reset button is clicked", async () => {
        const spy = jest.spyOn(React, 'useState')
        spy.mockImplementation((value) => [value, jest.fn()])
        render(<HikesFilters {...testProps} />, { wrapper: MemoryRouter })
        await userEvent.click(screen.getByRole('button', { name: "Reset" }))
        expect(testProps.setFilters).toHaveBeenCalledTimes(1)
        expect(testProps.close).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledTimes(4)
    })
})