import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import api from '@services/api'
import { AuthContext } from '@contexts/authContext'

import Hike from './Hike'

jest.mock('react-bootstrap', () => ({
    Col: (props) => <div>{props.children}</div>,
    Button: ({ children, ...props }) => <button {...props}>{children}</button>,
    Alert: (props) => <div data-testid="alert-message" {...props}>{props.children}</div>,
    Spinner: () => <div data-testid="loading-spinner" />
}))

const mockHikeDetails = {
    TrackMap: jest.fn(),
    Details: jest.fn()
}
jest.mock('@components/features', () => ({
    HikeDetails: {
        TrackMap: (props) => {
            mockHikeDetails.TrackMap(props)
            return <mock-TrackMap data-testid="hike-trackmap" />
        },
        Details: (props) => {
            mockHikeDetails.Details(props)
            return <mock-Details data-testid="hike-details" />
        }
    }
}))

jest.mock('axios')
jest.mock('@services/api')

describe('Hike page for visitors', () => {

    const setup = () => {
        api.hikes.getHikeDetails.mockResolvedValueOnce({})
        render(<Hike />)
    }

    beforeEach(() => act(() => setup()))

    it('Datails are correctly rendered', () => {
        expect(screen.getByTestId(/details/i)).toBeInTheDocument()
    })

    it('Alert message for authentication is correctly rendered', () => {
        expect(screen.getByTestId(/alert-message/i)).toHaveAttribute('variant', 'warning')
    })

    it('TrackMap is not rendered', async () => {
        expect(await screen.queryByTestId(/trackmap/i)).not.toBeInTheDocument()
    })

    it('Download button is not rendered', async () => {
        expect(await screen.queryByRole('button', { name: /download/i })).not.toBeInTheDocument()
    })
})

describe('Hike page for logged in users', () => {

    const setup = () => {
        api.hikes.getHikeDetails.mockResolvedValueOnce({})
        api.hikes.getHikeGPXFile.mockResolvedValueOnce({})
        render(
            <AuthContext.Provider value={[{ loggedIn: true }]}>
                <Hike />
            </AuthContext.Provider>
        )
    }

    beforeEach(() => act(() => setup()))

    it('Datails are correctly rendered', () => {
        expect(screen.getByTestId(/details/i)).toBeInTheDocument()
    })

    it('Alert message for authentication is not rendered', async () => {
        expect(await screen.queryByTestId(/alert-message/i)).not.toBeInTheDocument()
    })

    it('TrackMap is correctly rendered', () => {
        expect(screen.getByTestId(/trackmap/i)).toBeInTheDocument()
    })

    it('Download button is correctly rendered', () => {
        expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument()
    })

    it('Download button works correctly', async () => {
        await userEvent.click(screen.getByRole('button', { name: /download/i }))
        expect(api.hikes.getHikeGPXFile).toHaveBeenCalledTimes(1)

    })
})