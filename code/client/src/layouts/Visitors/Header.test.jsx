import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Header from './Header'

import { navigation } from '../../data'

jest.mock('./MobileSidebar', () => {
    return jest.fn(() => <div>Mocked mobile sidebar</div>);
});

describe("Header component", () => {
    it.each(navigation.desktop)("Link to $url is correctly rendered", (link) => {
        render(<Header />, { wrapper: MemoryRouter })
        expect(screen.getByRole("link", { name: link.label })).toHaveAttribute("href", link.url)
    })

    it("Logo is correctly rendered as a link to home", () => {
        render(<Header />, { wrapper: MemoryRouter })
        expect(screen.getByAltText("logo").parentElement).toHaveAttribute("href", "/")
    })

    it("Button to open mobile sideber is rendered and not visible on desktop device", () => {
        render(<Header />, { wrapper: MemoryRouter })

        expect(screen.getByTestId("mobile-sidebar-toggle")).toHaveClass("d-lg-none")
    })
})