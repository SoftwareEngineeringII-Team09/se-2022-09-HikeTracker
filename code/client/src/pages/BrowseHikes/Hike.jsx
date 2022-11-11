import { useParams } from 'react-router-dom'

const Hike = () => {
    const { hike } = useParams()

    return (
        <div>
            Hike {hike}
        </div>
    )
}

export default Hike