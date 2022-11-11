import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Layout from './Layout'

jest.mock("react-bootstrap", () => {
    const Container = ({ children }) => <div>{children}</div>
    const Row = ({ children }) => <div>{children}</div>

    return ({ Container, Row })
})

const mockHeader = jest.fn()
jest.mock("./Header", () => () => {
    mockHeader()
    return <mock-Header data-testid="header" />
})

describe("Visitors Layout component", () => {
    it("Header is correctly rendered", () => {
        render(<Layout />, { wrapper: MemoryRouter })
        expect(screen.getByTestId('header')).toBeInTheDocument()
    })
})