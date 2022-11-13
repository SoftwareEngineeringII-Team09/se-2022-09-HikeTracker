import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");

import NavLink from './NavLink'

const variants = ["link", "button"]

const testProps = {
    url: "/test/url",
    className: "test-class",
}

describe("NavLink component", () => {
    it("Navlink correctly rendered as a link", () => {
        render(<NavLink>I'm a link</NavLink>, { wrapper: MemoryRouter })
        expect(screen.getByRole("link", { name: "I'm a link" })).toBeInTheDocument()
    })

    it("The url prop correctly set the link href attribute", () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <NavLink url={testProps.url} />
            </Router>
        )
        expect(screen.getByRole("link")).toHaveAttribute("href", testProps.url)
        userEvent.click(screen.getByRole("link"))
        expect(history.location.pathname).toBe(testProps.url)
    })

    it("A link is rendered when the prop variant is correctly set as link", () => {
        render(
            <NavLink variant={variants[0]}>
                The variant is link
            </NavLink>, { wrapper: MemoryRouter })

        expect(screen.getByRole("link", { name: "The variant is link" })).toBeInTheDocument()
    })

    it("A button is rendered when the prop variant is correctly set as button", () => {
        render(
            <NavLink variant={variants[1]}>
                The variant is button
            </NavLink>, { wrapper: MemoryRouter })

        expect(screen.getByRole("link", { name: "The variant is button" }).firstChild).toHaveAttribute("type", "button")
    })

    it("ClassName prop is correctly set", () => {
        render(
            <NavLink className={testProps.className}>
                I'm a link
            </NavLink>, { wrapper: MemoryRouter })

        expect(screen.getByRole("link", { name: "I'm a link" })).toHaveClass(testProps.className)
    })
})