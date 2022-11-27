import { Circle, useMapEvents, } from 'react-leaflet'

const RadiusOnPoint = ({ radius, currentPoint, setCurrentPoint }) => {
    const map = useMapEvents({
        click: (e) => {
            setCurrentPoint({ lat: e.latlng.lat, lng: e.latlng.lng })
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return currentPoint.lat && currentPoint.lng ?
        <Circle center={[currentPoint.lat, currentPoint.lng]} radius={radius * 1000} />
        : null
}

export default RadiusOnPoint