import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Home from './Home'

describe("Home", () => {
    it("Home page correctly rendered", () => {
        render(<Home />, { wrapper: MemoryRouter })
        expect(screen.getByText("Welcome to Hike Tracker")).toBeInTheDocument();
    })

    it("Home page renders a link to navigate to browse hikes route", async () => {
        render(<Home />, { wrapper: MemoryRouter })
        expect(screen.getByRole("link")).toHaveAttribute("href", "/browse")
    })
})