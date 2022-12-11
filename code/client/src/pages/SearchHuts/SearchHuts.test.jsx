import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import api from '@services/api'
import SearchHuts from './SearchHuts'

jest.mock('react-bootstrap', () => {
    const Row = (props) => <div>{props.children}</div>
    const Spinner = (props) => <div>{props.children}</div>
    return ({ Row, Spinner })
})

jest.mock('@lib/helpers/filters', () => ({
    filterHuts: () => [],
    isFilteredHutsArrayEmpty: jest.fn()
}))

jest.mock('@services/api')

const mockHutCard = jest.fn()
const mockHutFilters = jest.fn()
jest.mock('@components/features', () => ({
    HutCard: (props) => {
        mockHutCard(props)
        return <mock-HutCard />
    },
    HutFilters: (props) => {
        mockHutsFilters(props)
        return <mock-HutsFilters />
    }
}))

describe("SearchHuts page", () => {
    it("Page is correctly rendered", async () => {
        const huts = []
        api.huts.getHuts.mockResolvedValueOnce(huts)

        render(<SearchHuts />, { wrapper: MemoryRouter })
        expect(api.huts.getHuts).toHaveBeenCalledTimes(1)
    })
})