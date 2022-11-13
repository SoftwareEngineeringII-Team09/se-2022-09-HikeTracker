import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");

import HutList from './HutList'

describe("Hut list page", () => {
    it("Hut list page correctly rendered", () => {
        render(<HutList />, { wrapper: MemoryRouter })
        expect(screen.getByText("Your huts")).toBeInTheDocument();
    })

    it("Hut list page renders a link to navigate to form to add new hut", () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <HutList />
            </Router>
        )
        expect(screen.getByRole("link")).toHaveAttribute("href", "/huts/add")
        userEvent.click(screen.getByRole("link"))
        expect(history.location.pathname).toBe("/huts/add")
    })
})