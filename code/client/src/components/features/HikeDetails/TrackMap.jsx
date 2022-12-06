import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import { AuthContext } from '@contexts/authContext';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useRef } from 'react';

const TrackMap = ({ hikeId, start, end, references = [], track, potentials = [] }) => {

    const popupElRef = useRef(null);
    const closePopup = () => popupElRef && popupElRef.current && popupElRef.current._closeButton && popupElRef.current._closeButton.click();

    return (
        <div className="track-map mb-5 mb-xl-0">
            <MapContainer center={start.coords} zoom={13} scrollWheelZoom style={{ height: "100%", zIndex: 90 }}>
                {references.map((ref, idx) => (
                    <Marker key={idx} position={ref.coords}>
                        <Popup>
                            <span className='fw-bold'>{ref.name}</span>
                        </Popup>
                    </Marker>
                ))}
                {potentials.map((ref, idx) => (
                    <Marker key={idx} position={ref.coords}>
                        <Popup className='text-center' ref={popupElRef}>
                            <span className='fw-bold'>{ref.name}</span>
                            <Button className='d-block mt-2' onClick={() => { closePopup(); ref.updatePoint(ref) }}>
                                Set as {ref.pointType} point
                            </Button>
                        </Popup>
                    </Marker>
                ))}
                <AuthContext.Consumer>
                    {([user]) => <>
                        <Marker position={start.coords} alt="Start marker">
                            <Popup>
                                <span className='fw-bold'>Start point</span>
                                <p className='m-0'>{start.name}</p>
                                {user.role === 'Local Guide' && hikeId && <NavLink to={`/hikes/${hikeId}/update-endpoints`}>Update Start Point</NavLink>}
                            </Popup>
                        </Marker>
                        <Marker position={end.coords} alt="End marker">
                            <Popup>
                                <span className='fw-bold'>End point</span>
                                <p className='m-0'>{end.name}</p>
                                {user.role === 'Local Guide' && hikeId && <NavLink to={`/hikes/${hikeId}/update-endpoints`}>Update End Point</NavLink>}
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