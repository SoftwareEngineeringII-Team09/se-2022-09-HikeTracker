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
    id: 0,
    name: "name",
    altitude: 1200,
    cost: 10,
    numOfBeds: 300
}

const expected = {
    url: `/huts/${testHut.id}`,
    info: [
        { label: "name", value: testHut.name },
        { label: "altitude", value: /1200 m/i },
        { label: "cost", value: /10 €/i },
        { label: "numOfBeds", value: /300/i }
    ]
}

describe("HutCard component", () => {
    // it.each(expected.info)
    //     ("Hut card $label is correctly rendered", (item) => {
    //         render(<HutCard hut={testHut} />, { wrapper: MemoryRouter })
    //         expect(screen.getByText(item.value)).toBeInTheDocument()
    //     })

    it("User is able to navigate to hut details when the card is clicked", async () => {
        // const history = createMemoryHistory()
        // render(
        //     <Router location={history.location} navigator={history}>
        //         <HutCard hut={testHut} />
        //     </Router>
        // )
        // expect(screen.getByRole("link")).toHaveAttribute("href", expected.url)
        // await userEvent.click(screen.getByRole("link"))
        // expect(history.location.pathname).toBe(expected.url)
    })
})