import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import HikeCard from './HikeCard'

jest.mock("react-bootstrap", () => {
    const Col = ({ children }) => <div>{children}</div>
    const Button = ({ children, ...props }) => <button {...props}>{children}</button>
    return ({ Col, Button })
})

const testHike = {
    id: 0,
    title: "title",
    writer: "writer",
    difficulty: "professional hiker",
    description: "description",
    maxElevation: 1200,
    length: 1,
    totalAscent: 300
}

const expected = {
    url: `/browse/${testHike.id}`,
    info: [
        { label: "title", value: testHike.title },
        { label: "writer", value: /created by writer/i },
        { label: "difficulty", value: testHike.difficulty },
        { label: "description", value: testHike.description },
        { label: "elevation", value: /1200 m/i },
        { label: "length", value: /1 km/i },
        { label: "ascent", value: /300 m/i }
    ]
}

describe("HikeCard component", () => {
    it.each(expected.info)
        ("Hike card $label is correctly rendered", (item) => {
            render(<HikeCard hike={testHike} />, { wrapper: MemoryRouter })
            expect(screen.getByText(item.value)).toBeInTheDocument()
        })

    it("User is able to navigate to hike details when the card is clicked", async () => {
        const history = createMemoryHistory()
        render(
            <Router location={history.location} navigator={history}>
                <HikeCard hike={testHike} />
            </Router>
        )
        expect(screen.getByRole("link")).toHaveAttribute("href", expected.url)
        await userEvent.click(screen.getByRole("link"))
        expect(history.location.pathname).toBe(expected.url)
    })
})