import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'

const TrackMap = ({ start, end, track }) => {
    return (
        <div className="track-map mb-5 mb-xl-0">
            <MapContainer center={start.coords} zoom={13} scrollWheelZoom style={{ height: "100%", zIndex: 90 }}>
                <Marker position={start.coords}>
                    <Popup>
                        <span className='fw-bold'>Start point</span>
                        <p className='m-0'>{start.name}</p>
                    </Popup>
                </Marker>
                <Marker position={end.coords}>
                    <Popup>
                        <span className='fw-bold'>End point</span>
                        <p className='m-0'>{end.name}</p>
                    </Popup>
                </Marker>
                <Polyline pathOptions={{ color: "red" }} positions={track} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </MapContainer>
        </div>
    )
}

export default TrackMap