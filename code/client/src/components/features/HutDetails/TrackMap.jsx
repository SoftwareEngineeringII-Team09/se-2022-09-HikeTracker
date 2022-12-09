import { MapContainer, TileLayer, Marker } from 'react-leaflet'

const TrackMap = (coords) => {
    const myCoords = Object.values(coords);
    return (
        <div className="track-map mb-5 mb-xl-0">
            <MapContainer center={[myCoords[0][0], myCoords[0][1]]} zoom={13} scrollWheelZoom style={{ height: "100%", zIndex: 90 }}>
                <Marker position={[myCoords[0][0], myCoords[0][1]]} />
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            </MapContainer>
        </div>
    )
}

export default TrackMap