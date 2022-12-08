import { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Button } from "react-bootstrap"

import { MapContainer, Marker, TileLayer, Popup, Polyline } from "react-leaflet"

import { AuthContext } from '@contexts/authContext'
import api from '@services/api'

const UpdateLinkedHuts = () => {
    const [user] = useContext(AuthContext)
    const { hikeId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [hike, setHike] = useState(null)
    const [linkableHuts, setLinkableHuts] = useState([])
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
                })
                .catch(err => toast.error(err, { theme: 'colored' }))
                .finally(() => setLoading(false))
    }, [loading]) // eslint-disable-line

    const handleSubmit = () => {

    }

    if (!loading)
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

                    <MapContainer center={hike.startPoint.coords} zoom={13} scrollWheelZoom style={{ height: 480 }} className="mt-5">
                        {huts.map((hut) => (
                            <Marker key={hut.hutId} position={hut.coords}>
                                <Popup>
                                    <p className='m-0'>{hut.hutName}</p>
                                    {/* <Button variant="link" size="sm" className="p-0 mt-2" onClick={() => handleRemovePoint(point)}>
                                        Remove reference point
                                    </Button> */}
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
}

export default UpdateLinkedHuts