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
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            </MapContainer>
        </div>
    )
}

export default TrackMap