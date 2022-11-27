import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const TrackMap = (p) => {
    return (
        <div className="track-map mb-5 mb-xl-0">
            <MapContainer center={p.coords} zoom={13} scrollWheelZoom style={{ height: "100%", zIndex: 90 }}>
                <Marker position={p.coords}>
                    <Popup>
                        <span className='fw-bold'>{p.name}</span>
                    </Popup>
                </Marker>
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            </MapContainer>
        </div>
    )
}

export default TrackMap