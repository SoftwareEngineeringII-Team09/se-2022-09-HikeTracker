import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Details from './Details'

jest.mock("@lib/helpers", () => ({
    helperLocation: {
        getLocationFullName: (province, city) => `c${city}, p${province}`
    }
}))

const testHike = {
    title: "title",
    writer: "writer",
    difficulty: "difficulty",
    province: 0,
    city: 0,
    description: "description",
    startPoint: {
        name: "start",
    },
    endPoint: {
        name: "end",
    },
    referencePoints: [
        { name: "ref1" },
        { name: "ref2" },
    ],
    maxElevation: 1200,
    length: 1,
    totalAscent: 300,
    expectedTime: {
        hours: 5,
        minutes: 30
    }
}

const expected = {
    base: [
        { label: "title", value: testHike.title },
        { label: "writer", value: testHike.writer },
        { label: "difficulty", value: testHike.difficulty },
        { label: "location", value: `c${testHike.city}, p${testHike.province}` },
        { label: "description", value: testHike.description },
        { label: "start point", value: testHike.startPoint.name },
        { label: "end point", value: testHike.endPoint.name },
        { label: "elevation", value: /1200 m/i },
        { label: "length", value: /1 km/i },
        { label: "ascent", value: /300 m/i },
        { label: "RT time", value: /5h : 30m/i }
    ],
    referencePoints: [
        ...testHike.referencePoints
    ]
}

describe("HikeDetails.Details component", () => {
    it.each(expected.base)
        ("Hike $label is correctly rendered", (item) => {
            render(<Details hike={testHike} />, { wrapper: MemoryRouter })
            expect(screen.getByText(item.value)).toBeInTheDocument()
        })

    it.each(expected.referencePoints)
        ("Hike reference point $name is correctly rendered", (point) => {
            render(<Details hike={testHike} />, { wrapper: MemoryRouter })
            expect(screen.getByText(point.name)).toBeInTheDocument()
        })
})