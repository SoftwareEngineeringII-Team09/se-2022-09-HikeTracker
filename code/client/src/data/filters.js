const filters = {
    difficulty: {
        type: "select",
        values: [
            "Tourist",
            "Hiker",
            "Professional Hiker"
        ]
    },
    length: {
        type: "range",
        unit: "km",
        values: [
            { max: 5 },
            { min: 5, max: 10 },
            { min: 10, max: 15 },
            { min: 15 },
        ]
    },
    ascent: {
        type: "range",
        unit: "m",
        values: [
            { max: 1000 },
            { min: 1000, max: 1500 },
            { min: 1500, max: 2000 },
            { min: 2000 },
        ]
    },
    roundtrip_time: {
        type: "range",
        unit: "h",
        values: [
            { max: 5 },
            { min: 5, max: 7 },
            { min: 7 },
        ]
    },
}

export default filters