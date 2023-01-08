import { useCallback, useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Button, Spinner } from "react-bootstrap"

import { MapContainer, Marker, TileLayer, Popup, Polyline } from "react-leaflet"

import { AuthContext } from '@contexts/authContext'
import api from '@services/api'

const UpdateLinkedHuts = () => {
    const [user] = useContext(AuthContext)
    const { hikeId } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [hike, setHike] = useState(null)
    const [linkableHuts, setLinkableHuts] = useState(null)
    const [huts, setHuts] = useState([])

    useEffect(() => {
        if (loading)
            api.hikes.getHikeDetails(hikeId)
                .then(hike => {
                    if (hike.writer.writerId !== user.userId) {
                        toast.error('Unauthorized operation', { theme: 'colored' })
                        navigate('/account/hikes')
                    }
                    setHike(hike)
                    setHuts(hike.huts)
                    api.hikes.getLinkableHuts(hikeId)
                        .then(huts => setLinkableHuts(huts
                            .filter(h => !hike.huts.some(hut => hut.hutId === h.hutId))
                            .map(h => ({
                                hutId: h.hutId,
                                hutName: h.hutName,
                                coords: [h.latitude, h.longitude]
                            }))))
                        .catch(err => toast.error(err, { theme: 'colored' }))
                        .finally(() => setLoading(false))
                })
                .catch(err => {
                    toast.error(err, { theme: 'colored' })
                    setLoading(false)
                })
    }, [loading]) // eslint-disable-line

    const handleAddLink = (hut) => {
        setHuts((old) => [...old, hut])
        setLinkableHuts((old) => old.filter(h => h.hutId !== hut.hutId))
    }

    const handleRemoveLink = (hut) => {
        setLinkableHuts((old) => [...old, hut])
        setHuts((old) => old.filter(h => h.hutId !== hut.hutId))
    }

    const handleSubmit = useCallback(() => {
        api.hikes.updateLinkedHuts(hikeId, huts.map(hut => hut.hutId))
            .then(() => {
                toast.success("Linked huts have been correctly updated!", { theme: 'colored' })
                navigate(`/hikes/${hikeId}`, { replace: true })
            })
            .catch(err => toast.error(err, { theme: 'colored' }))
    }, [huts])

    if (!loading && linkableHuts)
        return (
            <div className="my-5">
                <div>
                    <h1 className="fw-bold">Link huts to the hike</h1>
                    <p>
                        Select the hut you would link to this hike and click on the button. You can see linkable huts on the map.
                    </p>
                    <p className="fw-bold">
                        Have you already done? Click on Save changes button on the bottom!
                    </p>

                    <MapContainer center={hike.startPoint.coords} zoom={12} scrollWheelZoom style={{ height: 480 }} className="mt-5">
                        {huts.map((hut) => (
                            <Marker key={hut.hutId} position={hut.coords}>
                                <Popup>
                                    <p className='m-0'>{hut.hutName}</p>
                                    <Button variant="link" size="sm" className="p-0 mt-2" onClick={() => handleRemoveLink(hut)}>
                                        Remove this hut from linked ones
                                    </Button>
                                </Popup>
                            </Marker>
                        ))}
                        {linkableHuts.map((hut) => (
                            <Marker key={hut.hutId} position={hut.coords}>
                                <Popup>
                                    <p className='m-0'>{hut.hutName}</p>
                                    <Button variant="link" size="sm" className="p-0 mt-2" onClick={() => handleAddLink(hut)}>
                                        Link this hut to the hike
                                    </Button>
                                </Popup>
                            </Marker>
                        ))}
                        <Polyline pathOptions={{ color: "red" }} positions={hike.track} />
                        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png" />
                    </MapContainer>

                    <Button variant="primary-dark" size="lg" className="fw-bold py-3 w-100 mt-5" onClick={handleSubmit}>
                        Save changes
                    </Button>
                </div>
            </div>
        )
    else if (!loading && !linkableHuts)
        return (
            <div className="my-5 d-flex justify-content-center">
                <h3 className="fw-bold text-danger">Ops... something went wrong</h3>
            </div>
        )
    else return (
        <div role="status" className='h-100vh position-absolute top-50 start-50'>
            <Spinner animation="border" variant="primary-dark" />
        </div>
    )
}

export default UpdateLinkedHuts