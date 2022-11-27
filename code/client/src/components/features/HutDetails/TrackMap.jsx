import { MapContainer, TileLayer, Marker } from 'react-leaflet'

const TrackMap = (coords) => {
    console.log(coords)
    console.log(...coords)
    const myCoords = [coords[0], coords[1]]
    console.log(myCoords)
    return (
        <div className="track-map mb-5 mb-xl-0">
            <MapContainer center={coords} zoom={13} scrollWheelZoom style={{ height: "100%", zIndex: 90 }}>
                <Marker position={coords} />
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            </MapContainer>
        </div>
    )
}

export default TrackMap