import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import { AuthContext } from '@contexts/authContext';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const PotentialPointButton = ({ potential, onClick }) => {
    function handleClick() {
        onClick(potential)
    }

    return (
        <Button className='d-block mt-2' onClick={handleClick}>
            Set as {potential.pointType} point
        </Button>
    )
}

const TrackMap = ({ hikeId, start = {}, end = {}, references = [], track = [], potentials = [], linkedHuts = [] }) => {

    const closePopup = () => {
        document.querySelector(".leaflet-popup-close-button")?.click();
    };

    function handleSetAsStartEndPoint(potential) {
        closePopup()
        potential.updatePoint(potential)
    }

    return (
        <div className="track-map mb-5 mb-xl-0">
            <MapContainer center={start.coords} zoom={12} scrollWheelZoom style={{ height: "100%", zIndex: 90 }}>
                {linkedHuts.map((hut) => (
                    <Marker key={hut.hutId} position={hut.coords}>
                        <Popup>
                            <span className='fw-bold'>{hut.hutName}</span>
                        </Popup>
                    </Marker>
                ))}
                {references.map((ref) => (
                    <Marker key={`reference-point-${ref.name}`} position={ref.coords}>
                        <Popup>
                            <span className='fw-bold'>{ref.name}</span>
                        </Popup>
                    </Marker>
                ))}
                {potentials.map((potential) => (
                    <Marker key={potential.id + potential.pointType + (potential.potential || "")} position={potential.coords}>
                        <Popup className='text-center'>
                            <span className='fw-bold'>{potential.name}</span>
                            <PotentialPointButton potential={potential} onClick={handleSetAsStartEndPoint} />
                        </Popup>
                    </Marker>
                ))}
                <AuthContext.Consumer>
                    {([user]) => <>
                        <Marker position={start.coords} alt="Start marker">
                            <Popup>
                                <span className='fw-bold'>Start point</span>
                                <p className='m-0'>{start.name}</p>
                                {user.role === 'Local Guide' && hikeId && <NavLink to={`/account/hikes/${hikeId}/update/endpoints`}>Update Start Point</NavLink>}
                            </Popup>
                        </Marker>
                        <Marker position={end.coords} alt="End marker">
                            <Popup>
                                <span className='fw-bold'>End point</span>
                                <p className='m-0'>{end.name}</p>
                                {user.role === 'Local Guide' && hikeId && <NavLink to={`/account/hikes/${hikeId}/update/endpoints`}>Update End Point</NavLink>}
                            </Popup>
                        </Marker>
                    </>}
                </AuthContext.Consumer>
                <Polyline pathOptions={{ color: "red" }} positions={track} />
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            </MapContainer>
        </div>
    )
}

export default TrackMap