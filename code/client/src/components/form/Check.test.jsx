import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { Formik } from 'formik'

import Check from './Check'

const props = {
    id: "test-checkbox",
    name: "testCheckbox",
    label: "Test Check"
}

const initialValues = {
    default: { testCheckbox: false },
    active: { testCheckbox: true }
}

const Wrapped = {
    default: () => (
        <Formik initialValues={initialValues.default}>
            <Check {...props} />
        </Formik>
    ),
    active: () => (
        <Formik initialValues={initialValues.active}>
            <Check {...props} disabled />
        </Formik>
    ),
}

const setup = {
    default: () => render(<Wrapped.default />, { wrapper: MemoryRouter }),
    active: () => render(<Wrapped.active />, { wrapper: MemoryRouter }),
}

describe('Check component', () => {
    it('Component is correctly rendered', () => {
        setup.default()
        expect(screen.getByLabelText(new RegExp(props.label, "i"))).toBeInTheDocument()
    })

    it.each(Object.keys(props).filter(attr => attr !== "label"))
        ('Check %s attribute is correctly set',
            (attribute) => {
                setup.default()
                expect(screen.getByLabelText(new RegExp(props.label, "i")))
                    .toHaveAttribute(attribute, props[attribute])
            })

    it('Component is not active if its value is false', () => {
        setup.default()
        expect(screen.getByRole('button')).toHaveClass('bg-base-light')
        expect(screen.getByRole('button')).not.toHaveClass('bg-primary-dark')
    })

    it('Component is active if its value is true', () => {
        setup.active()
        expect(screen.getByRole('button')).toHaveClass('bg-primary-dark')
        expect(screen.getByRole('button')).not.toHaveClass('bg-base-light')
    })

    it('User is able to change checkbox status to active on click', async () => {
        setup.default()
        const check = screen.getByRole('button')
        expect(check).toHaveClass('bg-base-light')
        await userEvent.click(check)
        expect(check).toHaveClass('bg-primary-dark')
    })

    it('User is able to change checkbox status to unactive on click', async () => {
        setup.active()
        const check = screen.getByRole('button')
        expect(check).toHaveClass('bg-primary-dark')
        await userEvent.click(check)
        expect(check).toHaveClass('bg-base-light')
    })
})