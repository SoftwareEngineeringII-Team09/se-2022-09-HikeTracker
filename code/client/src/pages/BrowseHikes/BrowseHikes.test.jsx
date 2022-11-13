import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import BrowseHikes from './BrowseHikes'

jest.mock('react-bootstrap', () => {
    const Row = (props) => <div>{props.children}</div>
    return ({ Row })
})

jest.mock('@lib/helpers', () => ({
    helperFilters: {
        defaultFilters: {},
        filterHikes: () => []
    }
}))

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

jest.mock('axios', () => ({
    get: () => Promise.resolve({ data: {} })
}))

describe("BrowseHikes page", () => {
    it("Page is correctly rendered", () => {
        const setOpenMock = jest.fn()
        const setHikesMock = jest.fn()

        const useOpenMock = (useOpen) => [useOpen, setOpenMock]
        const useHikesMock = (useHikes) => [useHikes, setHikesMock]
        jest.spyOn(React, 'useState').mockImplementation(useOpenMock, useHikesMock)

        jest.spyOn(React, 'useEffect').mockImplementation((f) => f())

        render(<BrowseHikes />, { wrapper: MemoryRouter })
        expect(screen.getByText('Browse hikes')).toBeInTheDocument()
    })

    it("Filter button open filters sidebar when is clicked", () => {
        const setOpenMock = jest.fn()
        const setHikesMock = jest.fn()

        const useOpenMock = (useOpen) => [useOpen, setOpenMock]
        const useHikesMock = (useHikes) => [useHikes, setHikesMock]
        jest.spyOn(React, 'useState').mockImplementation(useOpenMock, useHikesMock)

        jest.spyOn(React, 'useEffect').mockImplementation((f) => f())

        render(<BrowseHikes />, { wrapper: MemoryRouter })
        userEvent.click(screen.getByRole('button'))
        expect(setOpenMock).toHaveBeenCalledTimes(1)
    })
})