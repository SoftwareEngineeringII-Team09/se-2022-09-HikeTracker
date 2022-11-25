import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");

import navigation from '@data/navigation'
import MobileSidebar from './MobileSidebar'

jest.mock("react-bootstrap", () => {
    const Offcanvas = (props) => {
        return <div>{props.children}</div>
    }

    Offcanvas.Header = (props) => <div>{props.children}</div>
    Offcanvas.Title = (props) => <span>{props.children}</span>
    Offcanvas.Body = (props) => <div>{props.children}</div>

    const Alert = (props) => {
        return <div>{props.children}</div>
    }

    Alert.Heading = (props) => <div>{props.children}</div>

    const Button = (props) => <button onClick={props.onClick}>{props.children}</button>

    return ({ Offcanvas: Offcanvas, Alert: Alert, Button: Button })
})

describe("MobileSidebar component", () => {
    it.each(navigation.mobile)("Link to $url is correctly rendered", async (link) => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <MobileSidebar />
            </Router>
        )
        expect(screen.getByRole("link", { name: link.label })).toHaveAttribute("href", link.url)
        await userEvent.click(screen.getByRole("link", { name: link.label }))
        expect(history.location.pathname).toBe(link.url)
    })

    it("Link to /signup is correctly rendered", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <MobileSidebar />
            </Router>
        )
        expect(screen.getByRole("link", { name: "Create an account now" })).toHaveAttribute("href", "/signup")
        await userEvent.click(screen.getByRole("link", { name: "Create an account now" }))
        expect(history.location.pathname).toBe("/signup")
    })

    it("Close prop function is called if close button is clicked", async () => {
        const close = jest.fn()
        render(<MobileSidebar close={close} />, { wrapper: MemoryRouter })
        await userEvent.click(screen.getByTestId("close-button"))
        expect(close).toHaveBeenCalledTimes(1)
    })

    it("Logout button is not rendered if user is not logged in", async () => {
        render(<MobileSidebar isLoggedIn={false} />, { wrapper: MemoryRouter })
        expect(await screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument()
    })

    it("Logout button is rendered if user is logged in", async () => {
        const history = createMemoryHistory();
        const handleLogout = jest.fn()
        render(
            <Router location={history.location} navigator={history}>
                <MobileSidebar isLoggedIn={true} handleLogout={handleLogout} />
            </Router>
        )
        expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument()
    })

    it("Calls handleLogout function if logout button is clicked", async () => {
        const handleLogout = jest.fn()
        render(<MobileSidebar isLoggedIn={true} handleLogout={handleLogout} />, { wrapper: MemoryRouter })
        await userEvent.click(screen.getByRole("button", { name: "Logout" }))
        expect(handleLogout).toHaveBeenCalledTimes(1)
    })

})
