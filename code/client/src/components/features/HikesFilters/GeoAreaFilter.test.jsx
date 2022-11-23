import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import GeoAreaFilter from './GeoAreaFilter'

jest.mock('react-bootstrap', () => {
    const Form = {
        Select: ({ children, ...props }) => <select {...props}>{children}</select>
    }

    return ({ Form })
})

const provinces = [
    { istat_provincia: 1, provincia: "p1" },
    { istat_provincia: 2, provincia: "p2" },
    { istat_provincia: 3, provincia: "p3" }
]

const cities = [
    { codiceistatcomune: 1, comune: "c1" },
    { codiceistatcomune: 2, comune: "c2" },
    { codiceistatcomune: 3, comune: "c3" },

]

jest.mock('@lib/helpers', () => ({
    helperLocation: { provinces: provinces, getCitiesForProvince: (province) => province ? cities : [] }
}))

const testProps = {
    default: {
        location: { province: 0, city: 0 },
        setProvince: jest.fn(),
        setCity: jest.fn()
    },
    provinceSelected: {
        location: { province: 1, city: 0 },
        setProvince: jest.fn(),
        setCity: jest.fn()
    }
}

describe("GeoAreaFilter components", () => {
    it("Selects are correctly rendered", () => {
        render(<GeoAreaFilter {...testProps.default} />, { wrapper: MemoryRouter })
        expect(screen.getAllByRole("combobox")).toHaveLength(2)
    })

    it("All options are rendered for province select", () => {
        render(<GeoAreaFilter {...testProps.default} />, { wrapper: MemoryRouter })
        const select = screen.getByTestId("province-select")
        expect(within(select).getAllByRole('option')).toHaveLength(1 + provinces.length)
    })

    it("Just default option is rendered for city select if province is not selected", () => {
        render(<GeoAreaFilter {...testProps.default} />, { wrapper: MemoryRouter })
        const select = screen.getByTestId("city-select")
        expect(within(select).getByRole('option', { name: "I want to leave this field empty" })).toHaveAttribute('value', "0")
        expect(within(select).getAllByRole('option')).toHaveLength(1)
    })

    it("All options are rendered for city select if province is selected", () => {
        render(<GeoAreaFilter {...testProps.provinceSelected} />, { wrapper: MemoryRouter })
        const select = screen.getByTestId("city-select")
        expect(within(select).getAllByRole('option')).toHaveLength(1 + cities.length)
    })

    it("City select is disabled when provice on is not selected", () => {
        render(<GeoAreaFilter {...testProps.default} />, { wrapper: MemoryRouter })
        expect(screen.getByTestId("city-select")).toHaveAttribute("disabled")
    })

    it("City select is enabled if province is selected", () => {
        render(<GeoAreaFilter {...testProps.provinceSelected} />, { wrapper: MemoryRouter })
        expect(screen.getByTestId("city-select")).not.toHaveAttribute("disabled")
    })

    it("Province select allows user to choose an option and sets province", async () => {
        render(<GeoAreaFilter {...testProps.default} />, { wrapper: MemoryRouter })
        const select = screen.getByTestId("province-select")
        await userEvent.selectOptions(select, within(select).getByRole('option', { name: provinces[0].provincia }))
        expect(testProps.default.setProvince).toHaveBeenCalledTimes(1)
        expect(testProps.default.setProvince).toHaveBeenCalledWith(provinces[0].istat_provincia)
    })

    it("City select allows user to choose an option and sets city", async () => {
        render(<GeoAreaFilter {...testProps.provinceSelected} />, { wrapper: MemoryRouter })
        const select = screen.getByTestId("city-select")
        await userEvent.selectOptions(select, within(select).getByRole('option', { name: cities[0].comune }))
        expect(testProps.provinceSelected.setCity).toHaveBeenCalledTimes(1)
        expect(testProps.provinceSelected.setCity).toHaveBeenCalledWith(cities[0].codiceistatcomune)
    })
})