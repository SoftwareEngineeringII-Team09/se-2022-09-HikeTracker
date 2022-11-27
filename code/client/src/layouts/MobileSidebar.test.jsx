import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");
import { AuthContext } from '@contexts/authContext'
import { toast } from "react-toastify"
import axios from 'axios'
import api from '@services/api'

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

jest.mock("axios");
jest.mock('@services/api');
jest.mock('react-toastify', () => {
    return {
        toast: {
            error: jest.fn()
        }
    };
});

describe("MobileSidebar component", () => {
    it.each(navigation.default.mobile)("Link to $url is correctly rendered", async (link) => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <AuthContext.Provider value={[{ loggedIn: false }]}>
                    <MobileSidebar />
                </AuthContext.Provider>
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
        render(<MobileSidebar />, { wrapper: MemoryRouter })
        expect(await screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument()
    })

    it("Logout button is rendered if user is logged in", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <AuthContext.Provider value={[{ loggedIn: true, role: "Local Guide" }]}>
                    <MobileSidebar />
                </AuthContext.Provider>
            </Router>
        )
        expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument()
    })

    it("Calls handleLogout function if logout button is clicked", async () => {
        const history = createMemoryHistory();
        api.users.logout.mockResolvedValue({});
        render(
            <Router location={history.location} navigator={history}>
                <AuthContext.Provider value={[{ loggedIn: true, role: "Local Guide" }]}>
                    <MobileSidebar />
                </AuthContext.Provider>
            </Router>
        );
        await userEvent.click(screen.getByRole("button", { name: "Logout" }))
        expect(api.users.logout).toHaveBeenCalledTimes(1)
    })

    it.each(navigation.LocalGuide)("Links to $url is shown to logged-in local guides", async (link) => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <AuthContext.Provider value={[{ loggedIn: true, role: "Local Guide" }]}>
                    <MobileSidebar />
                </AuthContext.Provider>
            </Router>
        )
        expect(screen.getByRole("link", { name: link.label })).toHaveAttribute("href", link.url)
        await userEvent.click(screen.getByRole("link", { name: link.label }))
        expect(history.location.pathname).toBe(link.url)
    })

    it("Renders Logout button when user is logged in", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <AuthContext.Provider value={[{ loggedIn: true, role: "Hiker" }]}>
                    <MobileSidebar />
                </AuthContext.Provider>
            </Router>
        )
        expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument()
    })

    it("Does not render Logout button when user is not logged in", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <AuthContext.Provider value={[{ loggedIn: false }]}>
                    <MobileSidebar />
                </AuthContext.Provider>
            </Router>
        )
        expect(await screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument()
    })

    it("Logout button calls logout api and redirects to home when successful", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <AuthContext.Provider value={[{ loggedIn: true, role: "Hiker" }]}>
                    <MobileSidebar />
                </AuthContext.Provider>
            </Router>
        )
        axios.delete.mockResolvedValue({})
        api.users.logout.mockResolvedValue({})
        await userEvent.click(screen.getByRole("button", { name: "Logout" }))
        expect(history.location.pathname).toBe('/')
    })

    it("Logout button calls logout api and shows error toast when unsuccessful", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <AuthContext.Provider value={[{ loggedIn: true, role: "Hiker" }]}>
                    <MobileSidebar />
                </AuthContext.Provider>
            </Router>
        )
        axios.delete.mockResolvedValue({})
        api.users.logout.mockRejectedValue({})
        await userEvent.click(screen.getByRole("button", { name: "Logout" }))
        expect(toast.error).toHaveBeenCalledTimes(1)
    })

})
