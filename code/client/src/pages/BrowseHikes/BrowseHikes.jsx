import { useState, useEffect } from 'react'
import { Row } from 'react-bootstrap'
import { FaFilter } from 'react-icons/fa'

import axios from 'axios'

import { helperFilters } from '@lib/helpers'
import { HikeCard, HikesFilters } from '@components/features'

const dummy = [
    {
        id: 1,
        title: "Sentiero per il Monte Ferra",
        writer: "Mario Rossi",
        max_elevation: "3094", // From gpx file --> max_elevation,
        description: "Descrizione del Sentiero per il Monte Ferra, in Val Varaita. Partenza da Rifugio Melezè a Bellino, in provincia di Cuneo.",
        difficulty: "Tourist",
        length: "13",
        total_ascent: "1280",
        expected_time: {
            hours: 5,
            minutes: 30
        },
        province: 2,
        city: 1001,
        startPoint: {
            coords: [11.10, 11.10]
        }
    },
    {
        id: 2,
        title: "Sentiero per Rocca Patanua",
        writer: "Mario Rossi",
        max_elevation: "2409", // From gpx file --> max_elevation,
        description: "Descrizione del Sentiero per la Rocca Patanua in Val di Susa. Partenza da Prarotto (Condove) in provincia di Torino.",
        difficulty: "Hiker",
        length: "13",
        total_ascent: "1280",
        expected_time: {
            hours: 4,
            minutes: 30
        },
        province: 2,
        city: 1001
    },
    {
        id: 3,
        title: "Sentiero per il Mont Ziccher",
        writer: "Mario Rossi",
        max_elevation: "1967", // From gpx file --> max_elevation,
        description: "Descrizione del Sentiero per il Monte Ziccher, nella Val Vigezzo. Partenza dal Rifugio Blitz, nel Verbano-Cusio-Ossola.",
        difficulty: "Professional Hiker",
        length: "13",
        total_ascent: "1280",
        expected_time: {
            hours: 7,
            minutes: 30
        },
        province: 1,
        city: 1001
    },
]

const BrowseHikes = () => {
    const [hikes, setHikes] = useState([])
    const [openFilters, setOpenFilters] = useState(false)
    const [filters, setFilters] = useState({
        active: false,
        ...helperFilters.defaultFilters
    })

    useEffect(() => {
        axios.get()
            .then((res) => { console.log(res) })
            .catch((err) => console.log(err))
            .finally(() => { setHikes(dummy) })
    }, [])

    return (
        <div className='my-5'>
            <div className="d-flex justify-content-between w-100 align-items-center mb-5 bg-light">
                <div>
                    <h1 className="fw-bold">Browse hikes</h1>
                    <p>See our amazing filters from the sidebar on the right</p>
                </div>
                <div>
                    <FaFilter role="button" size="28px" onClick={() => setOpenFilters(true)} />
                    <HikesFilters filters={filters} setFilters={setFilters} isOpen={openFilters} close={() => setOpenFilters(false)} />
                </div>
            </div>

            <Row className='g-4 pt-3 pb-5'>
                {!helperFilters.filterHikes(hikes, filters).length ? <span className='fs-5'>No hikes here...</span> :
                    helperFilters.filterHikes(hikes, filters).map((hike, idx) => (
                        <HikeCard key={idx} hike={hike} />
                    ))}
            </Row >
        </div >
    )
}

export default BrowseHikes