import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Formik } from 'formik'

import Location from './Location'

jest.mock('react-bootstrap', () => ({
    Row: (props) => <div>{props.children}</div>,
    Col: (props) => <div>{props.children}</div>
}))

const mockSelect = jest.fn()
jest.mock('@components/form', () => ({
    Select: (props) => {
        mockSelect(props)
        return <mock-Select data-testid={`select-${props.id}`} />
    }
}))


const initialValues = {
    geoArea: { location: { province: 0, city: 0 } }
}

const Wrapped = () => (
    <Formik initialValues={initialValues}>
        <Location />
    </Formik>
)

const filters = ["region", "province", "city"]

const setup = () => render(<Wrapped />, { wrapper: MemoryRouter })

beforeEach(setup)

describe('Location filter component', () => {
    it.each(filters)('Select to filter by %s is correctly rendered', (filter) => {
        expect(screen.getByTestId(`select-location-${filter}`)).toBeInTheDocument()
    })    
})