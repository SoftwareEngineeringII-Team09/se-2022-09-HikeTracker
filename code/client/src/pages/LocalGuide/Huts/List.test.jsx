import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");

import ListHuts from './List'

describe("Hut list page", () => {
    it("Hut list page correctly rendered", () => {
        render(<ListHuts />, { wrapper: MemoryRouter })
        expect(screen.getByText("Your huts:")).toBeInTheDocument();
    })

    it("Hut list page renders a link to navigate to form to add new hut", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <ListHuts />
            </Router>
        )
        expect(screen.getByRole("link")).toHaveAttribute("href", "/account/huts/add")
        await userEvent.click(screen.getByRole("link"))
        expect(history.location.pathname).toBe("/account/huts/add")
    })
})