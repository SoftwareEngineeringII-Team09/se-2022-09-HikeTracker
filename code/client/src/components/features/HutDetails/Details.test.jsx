import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Details from './Details'

jest.mock("@lib/helpers/location", () => ({
    getLocationFullName: (province, city) => `c${city}, p${province}`
}))

const testHut = {
    name: "name",
    province: 0,
    city: 0,
    altitude: 500,
    cost: 50,
    numOfBeds: 51
}

const expected = {
    base: [
        { label: "location", value: `c${testHut.city}, p${testHut.province}` },
        { label: "altitude", value: /500 m/i },
        { label: "cost", value: /50 €/i },
        { label: "numOfBeds", value: /51/i }
    ]
}

describe("HutDetails.Details component", () => {
    it.each(expected.base)
        ("Hut $label is correctly rendered", (item) => {
            render(<Details hut={testHut} />, { wrapper: MemoryRouter })
            expect(screen.getByText(item.value)).toBeInTheDocument()
        })
})