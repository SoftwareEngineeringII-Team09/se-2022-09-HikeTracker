import { render, screen } from '@testing-library/react'

import Tooltip from './Tooltip'

jest.mock('react-bootstrap', () => ({
    OverlayTrigger: (props) => <div {...props} data-testid="overlay">{props.children}</div>,
    Tooltip: (props) => <span data-testid="tip">{props.children}</span>
}))

const props = {
    placement: 'top',
    tip: 'Test tip',
}

const setup = () => render(<Tooltip {...props}>Hover me</Tooltip>)

beforeEach(() => setup())

describe("Tooltip component", () => {
    it('Component is correctly rendered', () => {
        expect(screen.getByText(/hover me/i)).toBeInTheDocument()
    })

    it('Placement is correctly set', () => {
        expect(screen.getByTestId(/overlay/i)).toHaveAttribute('placement', props.placement)
    })

    it('Overlay is correctly set', () => {
        expect(screen.getByTestId(/overlay/i)).toHaveAttribute('overlay')
    })
})