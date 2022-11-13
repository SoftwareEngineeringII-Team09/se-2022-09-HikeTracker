import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

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

const mockMobileSidebar = jest.fn()
jest.mock('./MobileSidebar', () => (props) => {
    mockMobileSidebar(props);
    return <mock-MobileSidebar data-testid="mobile-sidebar" {...props} />;
})

describe("Header component", () => {
    it.each(navigation.desktop)("Link to $url is correctly rendered", (link) => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <Header />
            </Router>
        )
        expect(screen.getByRole("link", { name: link.label })).toHaveAttribute("href", link.url)
        userEvent.click(screen.getByRole("link", { name: link.label }))
        expect(history.location.pathname).toBe(link.url)
    })

    it("Logo is correctly rendered as a link to home", () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <Header />
            </Router>
        )
        expect(screen.getByAltText("logo").parentElement).toHaveAttribute("href", "/")
        userEvent.click(screen.getByAltText("logo").parentElement)
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

    it("State changes when mobile sidebar toggler is clicked", () => {
        const setOpen = jest.fn()
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <Header />
            </Router>
        )
        const state = jest.spyOn(React, "useState")
        state.mockImplementation(open => [open, setOpen]);
        userEvent.click(screen.getByTestId("mobile-sidebar-toggle"))
        expect(state).toHaveBeenCalledTimes(1)
    })
})