import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import api from '@services/api'
import BrowseHikes from './BrowseHikes'

jest.mock('react-bootstrap', () => {
    const Row = (props) => <div>{props.children}</div>
    const Spinner = (props) => <div>{props.children}</div>
    return ({ Row, Spinner })
})

jest.mock('@lib/helpers/filters', () => ({
    filterHikes: () => [],
    isFilteredHikesArrayEmpty: jest.fn()
}))

jest.mock('@services/api')

const mockHikeCard = jest.fn()
const mockHikesFilters = jest.fn()
jest.mock('@components/features', () => ({
    HikeCard: (props) => {
        mockHikeCard(props)
        return <mock-HikeCard />
    },
    HikesFilters: (props) => {
        mockHikesFilters(props)
        return <mock-HikesFilters />
    }
}))

describe("BrowseHikes page", () => {
    it("Page is correctly rendered", async () => {
        const hikes = []
        api.hikes.getHikes.mockResolvedValueOnce(hikes)

        render(<BrowseHikes />, { wrapper: MemoryRouter })
        expect(api.hikes.getHikes).toHaveBeenCalledTimes(1)
        await waitFor(() => expect(screen.getByText('Browse hikes')).toBeInTheDocument())
    })
})