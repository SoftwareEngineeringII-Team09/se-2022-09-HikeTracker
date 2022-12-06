import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import HutCard from './HutCard'

jest.mock("react-bootstrap", () => {
    const Col = ({ children }) => <div>{children}</div>
    const Button = ({ children, ...props }) => <button {...props}>{children}</button>
    return ({ Col, Button })
})

const testHut = {
    hutId: 0,
    hutName: "name",
    pointId: 5,
    writerId: 0,
    city: 103024,
    province: 103,
    region: 1,
    altitude: 1200,
    cost: 10,
    numOfBeds: 300
}

const expected = {
    url: `/search/${testHut.hutId}`,
    info: [
        { label: "hutName", value: /name/i },
        { label: "altitude", value: /1200.00 m/i },
        { label: "cost", value: /10 €/i },
        { label: "numOfBeds", value: /300/i },
        { label: "city", value: /CRAVEGGIA/i },
        { label: "province", value: /VERBANO-CUSIO-OSSOLA/i },
        { label: "region", value: /PIEMONTE/i }
    ]
}

describe("HutCard component", () => {
    it.each(expected.info)
        ("Hut card $label is correctly rendered", (item) => {
            render(<HutCard hut={testHut} />, { wrapper: MemoryRouter })
            expect(screen.getByText(item.value)).toBeInTheDocument()
        })

    it("User is able to navigate to hut details when the card is clicked", async () => {
        const history = createMemoryHistory()
        render(
            <Router location={history.location} navigator={history}>
                <HutCard hut={testHut} />
            </Router>
        )
        expect(screen.getByRole("link")).toHaveAttribute("href", expected.url)
        await userEvent.click(screen.getByRole("link"))
        expect(history.location.pathname).toBe(expected.url)
    })
})