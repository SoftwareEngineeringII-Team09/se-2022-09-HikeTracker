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

    return ({ Offcanvas: Offcanvas, Alert: Alert })
})

describe("MobileSidebar component", () => {
    it.each(navigation.mobile)("Link to $url is correctly rendered", (link) => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <MobileSidebar />
            </Router>
        )
        expect(screen.getByRole("link", { name: link.label })).toHaveAttribute("href", link.url)
        userEvent.click(screen.getByRole("link", { name: link.label }))
        expect(history.location.pathname).toBe(link.url)
    })

    it("Link to /signup is correctly rendered", () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <MobileSidebar />
            </Router>
        )
        expect(screen.getByRole("link", { name: "Create an account now" })).toHaveAttribute("href", "/signup")
        userEvent.click(screen.getByRole("link", { name: "Create an account now" }))
        expect(history.location.pathname).toBe("/signup")
    })

    it("Close prop function is called if close button is clicked", () => {
        const close = jest.fn()
        render(<MobileSidebar close={close} />, { wrapper: MemoryRouter })
        userEvent.click(screen.getByTestId("close-button"))
        expect(close).toHaveBeenCalledTimes(1)
    })
})
