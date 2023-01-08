import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { Formik } from 'formik'

import File from './File'

const file = require('@data/test/monteFerra.jpeg')

jest.mock('react-bootstrap', () => {
    const Form = ({ children, ...props }) => <form {...props}>{children}</form>

    Form.Group = ({ children }) => <div>{children}</div>
    Form.Label = ({ children, ...props }) => <label {...props}>{children}</label>
    Form.Text = ({ children, ...props }) => <p {...props}>{children}</p>

    return ({ Form })
})

const props = {
    id: "test-file",
    name: "testFile",
    label: "Test File",
    accept: "image/*",
    onChange: jest.fn(),
}

const initialValues = { testFile: "" }
const initialTouched = { testFile: true }
const initialErrors = { testFile: "Validation error" }

const initialProps = {
    default: { initialValues },
    error: { initialValues, initialTouched, initialErrors },
    success: { initialValues, initialTouched },
}

const Wrapped = {
    default: () => (
        <Formik {...initialProps.default}>
            <File {...props} />
        </Formik>
    ),
    disabled: () => (
        <Formik {...initialProps.default}>
            <File {...props} disabled />
        </Formik>
    ),
    success: () => (
        <Formik {...initialProps.success}>
            <File {...props} />
        </Formik>
    ),
    error: () => (
        <Formik {...initialProps.error}>
            <File {...props} />
        </Formik>
    )
}

const setup = {
    default: () => render(<Wrapped.default />, { wrapper: MemoryRouter }),
    disabled: () => render(<Wrapped.disabled />, { wrapper: MemoryRouter }),
    success: () => render(<Wrapped.success />, { wrapper: MemoryRouter }),
    error: () => render(<Wrapped.error />, { wrapper: MemoryRouter }),
}

describe("File component", () => {
    it("Component is correctly rendered", () => {
        setup.default()
        expect(screen.getByLabelText(props.label)).toBeInTheDocument()
    })

    it.each(Object.keys(props).filter(attr => attr !== "label" && attr != "onChange"))
        ('File %s is correctly set',
            (attribute) => {
                setup.default()
                expect(screen.getByLabelText(props.label)).toHaveAttribute(attribute, props[attribute])
            })

    it("File is not disabled if prop is not true", () => {
        setup.default()
        expect(screen.getByLabelText(props.label).disabled).toBe(false)
        expect(screen.getByLabelText(props.label)).not.toHaveClass("opacity-50")
    })

    it("File is disabled if prop is true", () => {
        setup.disabled()
        expect(screen.getByLabelText(props.label).disabled).toBe(true)
        expect(screen.getByLabelText(props.label)).toHaveClass("opacity-50")
    })

    it("Error style is applied to the input when a validation error occurs", () => {
        setup.error()
        expect(screen.getByLabelText(props.label)).toHaveClass("is-invalid")
        expect(screen.getByLabelText(props.label)).not.toHaveClass("is-valid")
    })

    it("Success style is applied to the input when there is no validation error", () => {
        setup.success()
        expect(screen.getByLabelText(props.label)).toHaveClass("is-valid")
        expect(screen.getByLabelText(props.label)).not.toHaveClass("is-invalid")
    })

    it("Error message is not visable when there is no validation error", () => {
        setup.default()
        expect(screen.queryByTestId(/error-message/i)).not.toBeInTheDocument()
    })

    it("Error message is visable when there is a validation error", () => {
        setup.error()
        const error = screen.queryByTestId(/error-message/i)
        expect(error.innerHTML).toBe(initialErrors.testFile)
        expect(error).toHaveClass("text-danger")
    })

    it("User is able to upload a file", async () => {
        setup.default()
        const input = screen.getByLabelText(props.label)
        await userEvent.upload(input, file, { applyAccept: false })
        expect(props.onChange).toHaveBeenCalledTimes(1);
    })
})