import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import FilterRadioButton from './FilterRadioButton'

const testProps = {
    active: false,
    onClick: jest.fn(),
}

describe("FilterRadioButton component", () => {
    it("Component is correctly rendered", () => {
        render(<FilterRadioButton {...testProps} />, { wrapper: MemoryRouter })
        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it("Component execute onClick function when is clicked", async () => {
        render(<FilterRadioButton {...testProps} />, { wrapper: MemoryRouter })
        await userEvent.click(screen.getByRole('button'))
        expect(testProps.onClick).toHaveBeenCalledTimes(1)
    })
})