import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { AuthContext } from '../../contexts/authContext'
import { toast } from "react-toastify"
import axios from 'axios'
import api from '../../services/api'

import Header from './Header'

import navigation from '@data/navigation'

jest.mock("react-bootstrap", () => {
    const Navbar = (props) => {
        return <nav>{props.children}</nav>
    }

    Navbar.Brand = (props) => <div>{props.children}</div>

    const Button = ({ children, ...props }) => {
        return <button {...props}>{children}</button>
    }

    return ({ Navbar: Navbar, Button: Button })
})

/* Mocking the logout api and error toast */
jest.mock("axios");
jest.mock('../../services/api');
jest.mock('react-toastify', () => {
    return {
        toast: {
            error: jest.fn()
        }
    };
});

const mockMobileSidebar = jest.fn()
jest.mock('./MobileSidebar', () => (props) => {
    mockMobileSidebar(props);
    return <mock-MobileSidebar data-testid="mobile-sidebar" {...props} />;
})

describe("Header component", () => {
    it.each(navigation.desktop)("Link to $url is correctly rendered", async (link) => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <AuthContext.Provider value={[{ loggedIn: false, role: "Visitor" }]}>
                    <Header />
                </AuthContext.Provider>
            </Router>
        )
        expect(screen.getByRole("link", { name: link.label })).toHaveAttribute("href", link.url)
        await userEvent.click(screen.getByRole("link", { name: link.label }))
        expect(history.location.pathname).toBe(link.url)
    })

    it.each(navigation.desktop)("Links to login/registration are not shown to logged-in users", async (link) => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <AuthContext.Provider value={[{ loggedIn: true, role: "Hiker" }]}>
                    <Header />
                </AuthContext.Provider>
            </Router>
        )
        if (link.users.includes("Hiker") || link.users.includes("All")) {
            expect(screen.getByRole("link", { name: link.label })).toHaveAttribute("href", link.url)
            await userEvent.click(screen.getByRole("link", { name: link.label }))
            expect(history.location.pathname).toBe(link.url)
        } else {
            expect(screen.queryByRole("link", { name: link.label })).not.toBeInTheDocument()
        }
    })

    it("Logo is correctly rendered as a link to home", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <Header />
            </Router>
        )
        expect(screen.getByAltText("logo").parentElement).toHaveAttribute("href", "/")
        await userEvent.click(screen.getByAltText("logo").parentElement)
        expect(history.location.pathname).toBe('/')
    })

    it("Button to open mobile sideber is rendered and not visible on desktop device", async () => {
        render(<Header />, { wrapper: MemoryRouter })
        expect(screen.getByTestId("mobile-sidebar-toggle")).toHaveClass("d-lg-none")
    })

    it("Mobile sidebar is hidden when header is rendered", () => {
        render(<Header />, { wrapper: MemoryRouter })
        expect(mockMobileSidebar).toHaveBeenCalledWith(
            expect.objectContaining({
                isOpen: false,
            })
        );
    })

    // it("State changes when mobile sidebar toggler is clicked", async () => {
    //     const setOpen = jest.fn()
    //     const history = createMemoryHistory();
    //     render(
    //         <Router location={history.location} navigator={history}>
    //             <Header />
    //         </Router>
    //     )
    //     const state = jest.spyOn(React, "useState")
    //     state.mockImplementation(open => [open, setOpen]);
    //     await userEvent.click(screen.getByTestId("mobile-sidebar-toggle"))
    //     expect(state).toHaveBeenCalledTimes(1)
    // })

    it("Renders Logout button when user is logged in", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <AuthContext.Provider value={[{ loggedIn: true, role: "Hiker" }]}>
                    <Header />
                </AuthContext.Provider>
            </Router>
        )
        expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument()
    })

    it("Does not render Logout button when user is not logged in", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <AuthContext.Provider value={[{ loggedIn: false, role: "Visitor" }]}>
                    <Header />
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
                    <Header />
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
                    <Header />
                </AuthContext.Provider>
            </Router>
        )
        axios.delete.mockResolvedValue({})
        api.users.logout.mockRejectedValue({})
        await userEvent.click(screen.getByRole("button", { name: "Logout" }))
        expect(toast.error).toHaveBeenCalledTimes(1)
    })

})