import { Marker, useMapEvents } from 'react-leaflet'

const MarkerOnPoint = ({ point, setPoint }) => {
    const map = useMapEvents({
        click: (e) => {
            setPoint({ latitude: e.latlng.lat, longitude: e.latlng.lng })
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return point.latitude && point.longitude ?
        <Marker position={[point.latitude, point.longitude]} />
        : null
}

export default MarkerOnPoint